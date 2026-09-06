import {
    Types,
} from "mongoose";

import { Role } from "@/models/role.model";
import { BaseRepository } from "@/repositories/base.repository";
import { IRole } from "@/types/role.types";

export class RoleRepository
    extends BaseRepository<IRole> {
    constructor() {
        super(Role);
    }

    async findByName(name: string) {
        return this.model.findOne({
            name: name.trim().toLowerCase(),
        });
    }

    async findDefaultRole() {
        return this.model.findOne({
            isDefault: true,
        });
    }

    async clearDefaultRoles(
        exceptId?: Types.ObjectId
    ) {
        const filter: Record<string, unknown> = {
            isDefault: true,
        };

        if (exceptId) {
            filter._id = {
                $ne: exceptId,
            };
        }

        return this.model.updateMany(
            filter,
            {
                $set: {
                    isDefault: false,
                },
            }
        );
    }

    async findActiveRoles() {
        return this.model.find({
            status: "active",
        }).sort({
            isDefault: -1,
            name: 1,
        });
    }

    async findManyWithSearch(
        search?: string,
        status?: string,
        page = 1,
        limit = 20
    ) {
        const filter: Record<
            string,
            unknown
        > = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [roles, total] =
            await Promise.all([
                this.model
                    .find(filter)
                    .sort({
                        isDefault: -1,
                        name: 1,
                    })
                    .skip(skip)
                    .limit(limit),

                this.model.countDocuments(
                    filter
                ),
            ]);

        return {
            roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            ),
        };
    }

    async countUsersByRole(
        roleId: string | Types.ObjectId
    ) {
        const { User } = await import(
            "@/models/user.model"
        );

        return User.countDocuments({
            role: new Types.ObjectId(
                roleId
            ),
        });
    }

    async countUsersByRoles(
        roleIds: string[]
    ) {
        const { User } = await import(
            "@/models/user.model"
        );

        return User.aggregate([
            {
                $match: {
                    role: {
                        $in: roleIds.map(
                            (id) =>
                                new Types.ObjectId(id)
                        ),
                    },
                },
            },

            {
                $group: {
                    _id: "$role",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
    }
}

export const roleRepository =
    new RoleRepository();