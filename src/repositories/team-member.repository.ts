import {
    SortOrder,
    Types,
} from "mongoose";

import { TeamMember } from "@/models/team-member.model";

import { ITeamMember } from "@/types/team-member.types";

class TeamMemberRepository {
    async create(
        data: Partial<ITeamMember>
    ) {
        return TeamMember.create(data);
    }

    async findById(id: string) {
        return TeamMember.findById(id)
            .populate("avatar")
            .populate("gallery")
            .populate(
                "author",
                "name email avatar"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "updatedBy",
                "name email"
            );
    }

    async findBySlug(
        slug: string
    ) {
        return TeamMember.findOne({
            slug,
            isDeleted: false,
        });
    }

    async slugExists(
        slug: string,
        excludeId?: string
    ) {
        const filter: {
            slug: string;
            isDeleted: boolean;
            _id?: {
                $ne: Types.ObjectId;
            };
        } = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne: new Types.ObjectId(
                    excludeId
                ),
            };
        }

        return TeamMember.exists(filter);
    }

    async getTeamMembers(
        filter: Record<
            string,
            unknown
        >,
        page: number,
        limit: number,
        sort: Record<
            string,
            SortOrder
        >
    ) {
        return TeamMember.find(filter)
            .populate("avatar")
            .populate(
                "gallery"
            )
            .populate(
                "author",
                "name email avatar"
            )
            .sort(sort)
            .skip(
                (page - 1) * limit
            )
            .limit(limit);
    }

    async countTeamMembers(
        filter: Record<
            string,
            unknown
        >
    ) {
        return TeamMember.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<ITeamMember>
    ) {
        return TeamMember.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string) {
        return TeamMember.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async restore(id: string) {
        return TeamMember.findByIdAndUpdate(
            id,
            {
                isDeleted: false,
                deletedAt: null,
            },
            {
                new: true,
            }
        );
    }

    async changeStatus(
        id: string,
        status: string
    ) {
        return TeamMember.findByIdAndUpdate(
            id,
            {
                status,
            },
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async changeEmploymentStatus(
        id: string,
        employmentStatus:
            | "active"
            | "inactive"
    ) {
        return TeamMember.findByIdAndUpdate(
            id,
            {
                employmentStatus,
            },
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        return TeamMember.findByIdAndUpdate(
            id,
            {
                featured,
            },
            {
                new: true,
                runValidators: true,
            }
        );
    }
}

export default new TeamMemberRepository();