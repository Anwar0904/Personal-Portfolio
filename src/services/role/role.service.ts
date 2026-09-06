import {
    Types,
} from "mongoose";

import { ApiError } from "@/lib/api/api-error";

import {
    roleRepository,
} from "@/repositories/role.repository";

import { IRole } from "@/types/role.types";

export interface RoleListQuery {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

class RoleService {
    async createRole(
        data: Partial<IRole>
    ) {
        const name =
            data.name
                ?.trim()
                .toLowerCase();

        if (!name) {
            throw new ApiError(
                400,
                "Role name is required."
            );
        }

        const exists =
            await roleRepository.findByName(
                name
            );

        if (exists) {
            throw new ApiError(
                409,
                "Role already exists."
            );
        }

        if (data.isDefault) {
            await this.clearDefaultRole();
        }

        return roleRepository.create({
            ...data,
            name,
        });
    }

    async getRoles(
        query: RoleListQuery = {}
    ) {
        const result =
            await roleRepository.findManyWithSearch(
                query.search,
                query.status,
                query.page ?? 1,
                query.limit ?? 20
            );

        const roleIds =
            result.roles.map((role) =>
                role._id.toString()
            );

        const counts =
            await roleRepository.countUsersByRoles(
                roleIds
            );

        const countMap = new Map(
            counts.map((item) => [
                item._id.toString(),
                item.count,
            ])
        );

        return {
            roles: result.roles.map(
                (role) => ({
                    ...role.toObject(),
                    userCount:
                        countMap.get(
                            role._id.toString()
                        ) ?? 0,
                })
            ),

            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages:
                    result.totalPages,
            },
        };
    }

    async getRoleById(
        id: string | Types.ObjectId
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid role ID."
            );
        }

        const role =
            await roleRepository.findById(
                id
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        const userCount =
            await roleRepository.countUsersByRole(
                id
            );

        return {
            ...role.toObject(),
            userCount,
        };
    }

    async updateRole(
        id: string | Types.ObjectId,
        data: Partial<IRole>
    ) {
        const role =
            await roleRepository.findById(
                id
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        if (
            data.name &&
            data.name !== role.name
        ) {
            const name =
                data.name
                    .trim()
                    .toLowerCase();

            const exists =
                await roleRepository.findByName(
                    name
                );

            if (
                exists &&
                exists._id.toString() !==
                role._id.toString()
            ) {
                throw new ApiError(
                    409,
                    "Role name already exists."
                );
            }

            data.name = name;
        }

        if (
            data.isDefault === true
        ) {
            await this.clearDefaultRole(
                role._id
            );
        }

        if (
            role.isDefault &&
            data.isDefault === false
        ) {
            throw new ApiError(
                400,
                "The default role cannot be unset directly."
            );
        }

        return roleRepository.updateById(
            id,
            data
        );
    }

    async deleteRole(
        id: string | Types.ObjectId
    ) {
        const role =
            await roleRepository.findById(
                id
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        if (role.isDefault) {
            throw new ApiError(
                400,
                "Default role cannot be deleted."
            );
        }

        const userCount =
            await roleRepository.countUsersByRole(
                id
            );

        if (userCount > 0) {
            throw new ApiError(
                409,
                `This role is assigned to ${userCount} user(s) and cannot be deleted.`
            );
        }

        await roleRepository.deleteById(
            id
        );

        return true;
    }

    async assignPermissions(
        id: string | Types.ObjectId,
        permissions: string[]
    ) {
        const role =
            await roleRepository.findById(
                id
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        const uniquePermissions = [
            ...new Set(permissions),
        ];

        return roleRepository.updateById(
            id,
            {
                permissions:
                    uniquePermissions,
            }
        );
    }

    async getDefaultRole() {
        return roleRepository.findDefaultRole();
    }

    async findByName(name: string) {
        return roleRepository.findByName(
            name
        );
    }

    async setDefaultRole(
        id: string
    ) {
        const role =
            await roleRepository.findById(
                id
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        await this.clearDefaultRole(
            role._id
        );

        return roleRepository.updateById(
            id,
            {
                isDefault: true,
            }
        );
    }

    private async clearDefaultRole(
        exceptId?: Types.ObjectId
    ) {
        await roleRepository.clearDefaultRoles(
            exceptId
        );
    }
}

export const roleService =
    new RoleService();