import {
    SortOrder,
    Types,
} from "mongoose";

import { PasswordService } from "@/lib/auth/bcrypt";
import { ApiError } from "@/lib/api/api-error";

import { User } from "@/models/user.model";
import { Role } from "@/models/role.model";

import UserRepository from "@/repositories/user.repository";

import {
    CreateUserInput,
    UpdateUserInput,
    UserQuery,
} from "@/types/user-management";

import {
    USER_STATUS,
} from "@/enums";

import {
    isSuperAdmin,
} from "@/lib/auth/super-admin";

class UserService {

    async getUsers(
        query: UserQuery
    ) {
        const page =
            Number(query.page ?? 1);

        const limit =
            Number(query.limit ?? 20);

        const filter: Record<
            string,
            unknown
        > = {};

        if (!query.includeDeleted) {
            filter.isDeleted = false;
        }

        if (query.search) {
            const search =
                query.search.trim();

            filter.$or = [
                {
                    firstName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    jobTitle: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (query.role) {
            if (
                Types.ObjectId.isValid(
                    query.role
                )
            ) {
                filter.role =
                    new Types.ObjectId(
                        query.role
                    );
            }
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        if (
            query.verified !== undefined
        ) {
            filter.isEmailVerified =
                query.verified;
        }

        let sort:
            Record<string, SortOrder> = {
            createdAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.replace(
                    /^-/,
                    ""
                );

            const direction =
                query.sort.startsWith(
                    "-"
                )
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [users, total] =
            await Promise.all([
                UserRepository.findMany(
                    filter,
                    page,
                    limit,
                    sort
                ),
                UserRepository.count(
                    filter
                ),
            ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(
                        total / limit
                    ),
            },
        };
    }

    async getUserById(
        id: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid user ID."
            );
        }

        const user =
            await UserRepository.findById(
                id
            );

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        return user;
    }

    async createUser(
        data: CreateUserInput,
        currentUserId: string
    ) {
        const email =
            data.email.toLowerCase();

        const exists =
            await UserRepository.emailExists(
                email
            );

        if (exists) {
            throw new ApiError(
                409,
                "Email already exists."
            );
        }

        const role =
            await Role.findById(
                data.role
            );

        if (!role) {
            throw new ApiError(
                404,
                "Role not found."
            );
        }

        if (
            ["super_admin", "super admin"].includes(
                role.name.toLowerCase()
            ) &&
            currentUserId
        ) {
            const currentUser =
                await User.findById(
                    currentUserId
                ).populate("role");

            if (
                !isSuperAdmin(
                    currentUser?.role as never
                )
            ) {
                throw new ApiError(
                    403,
                    "Only a Super Admin can create a Super Admin."
                );
            }
        }

        const hashedPassword =
            await PasswordService.hash(
                data.password
            );

        return UserRepository.create({
            firstName:
                data.firstName.trim(),

            lastName:
                data.lastName?.trim() ?? "",

            email,

            password:
                hashedPassword,

            role:
                new Types.ObjectId(
                    data.role
                ),

            status:
                data.status ??
                USER_STATUS.ACTIVE,

            phone:
                data.phone ?? null,

            jobTitle:
                data.jobTitle ?? null,

            avatar:
                data.avatar ?? null,

            isEmailVerified:
                data.isEmailVerified ??
                false,

            createdBy:
                new Types.ObjectId(
                    currentUserId
                ),

            updatedBy:
                new Types.ObjectId(
                    currentUserId
                ),

            isDeleted: false,

            deletedAt: null,

            passwordChangedAt:
                new Date(),
        });
    }

    async updateUser(
        id: string,
        data: UpdateUserInput,
        currentUserId: string
    ) {
        const user =
            await User.findById(id)
                .populate("role");

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        const currentUser =
            await User.findById(
                currentUserId
            ).populate("role");

        const currentIsSuperAdmin =
            isSuperAdmin(
                currentUser?.role as never
            );

        const targetIsSuperAdmin =
            isSuperAdmin(
                user.role as never
            );

        if (
            targetIsSuperAdmin &&
            !currentIsSuperAdmin
        ) {
            throw new ApiError(
                403,
                "Super Admin accounts can only be modified by a Super Admin."
            );
        }

        if (
            data.role &&
            data.role !==
            user.role?._id.toString()
        ) {
            const newRole =
                await Role.findById(
                    data.role
                );

            if (!newRole) {
                throw new ApiError(
                    404,
                    "Role not found."
                );
            }

            if (
                ["super_admin", "super admin"].includes(
                    newRole.name.toLowerCase()
                ) &&
                !currentIsSuperAdmin
            ) {
                throw new ApiError(
                    403,
                    "Only a Super Admin can assign the Super Admin role."
                );
            }
        }

        if (
            data.email &&
            data.email.toLowerCase() !==
            user.email
        ) {
            const exists =
                await UserRepository.emailExists(
                    data.email,
                    id
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Email already exists."
                );
            }

            user.email =
                data.email.toLowerCase();
        }

        if (
            data.firstName !==
            undefined
        )
            user.firstName =
                data.firstName.trim();

        if (
            data.lastName !==
            undefined
        )
            user.lastName =
                data.lastName.trim();

        if (
            data.role !==
            undefined
        ) {
            user.role =
                new Types.ObjectId(
                    data.role
                );
        }

        if (
            data.status !==
            undefined
        )
            user.status =
                data.status;

        if (
            data.phone !==
            undefined
        )
            user.phone =
                data.phone;

        if (
            data.jobTitle !==
            undefined
        )
            user.jobTitle =
                data.jobTitle;

        if (
            data.avatar !==
            undefined
        )
            user.avatar =
                data.avatar;

        if (
            data.isEmailVerified !==
            undefined
        )
            user.isEmailVerified =
                data.isEmailVerified;

        user.updatedBy =
            new Types.ObjectId(
                currentUserId
            );

        await user.save();

        return UserRepository.findById(
            id
        );
    }

    async deleteUser(
        id: string,
        currentUserId: string
    ) {
        if (id === currentUserId) {
            throw new ApiError(
                400,
                "You cannot delete your own account."
            );
        }

        const target =
            await User.findById(id)
                .populate("role");

        if (!target) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (
            isSuperAdmin(
                target.role as never
            )
        ) {
            throw new ApiError(
                403,
                "Super Admin accounts cannot be deleted."
            );
        }

        await UserRepository.softDelete(
            id
        );

        return true;
    }

    async restoreUser(
        id: string
    ) {
        const user =
            await User.findById(id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        return UserRepository.restore(
            id
        );
    }

    async changeStatus(
        id: string,
        status: string,
        currentUserId: string
    ) {
        if (id === currentUserId) {
            throw new ApiError(
                400,
                "You cannot disable your own account."
            );
        }

        const user =
            await User.findById(id)
                .populate("role");

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (
            isSuperAdmin(
                user.role as never
            )
        ) {
            throw new ApiError(
                403,
                "Super Admin status cannot be changed here."
            );
        }

        user.status = status as never;

        await user.save();

        return UserRepository.findById(
            id
        );
    }
}

export default new UserService();