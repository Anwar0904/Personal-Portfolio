import {
    SortOrder,
    Types,
} from "mongoose";

import {
    TeamMember,
} from "@/models/team-member.model";

import TeamMemberRepository from "@/repositories/team-member.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateTeamMemberInput,
    UpdateTeamMemberInput,
    TeamMemberQuery,
} from "@/types/team-member-management";

class TeamMemberService {
    async getTeamMembers(
        query: TeamMemberQuery
    ) {
        const page =
            Number(query.page ?? 1);

        const limit =
            Number(query.limit ?? 10);

        const filter: Record<
            string,
            unknown
        > = {
            isDeleted: false,
        };

        if (query.search?.trim()) {
            filter.$text = {
                $search:
                    query.search.trim(),
            };
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        if (
            query.employmentStatus
        ) {
            filter.employmentStatus =
                query.employmentStatus;
        }

        if (query.author) {
            if (
                !Types.ObjectId.isValid(
                    query.author
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid author ID."
                );
            }

            filter.author =
                new Types.ObjectId(
                    query.author
                );
        }

        if (
            query.featured !==
            undefined
        ) {
            filter.featured =
                query.featured;
        }

        let sort: Record<
            string,
            SortOrder
        > = {
            createdAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.startsWith("-")
                    ? query.sort.substring(1)
                    : query.sort;

            sort = {
                [field]:
                    query.sort.startsWith("-")
                        ? -1
                        : 1,
            };
        }

        const [
            teamMembers,
            total,
        ] = await Promise.all([
            TeamMemberRepository.getTeamMembers(
                filter,
                page,
                limit,
                sort
            ),

            TeamMemberRepository.countTeamMembers(
                filter
            ),
        ]);

        return {
            teamMembers,
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

    async getTeamMemberById(
        id: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid team member ID."
            );
        }

        const teamMember =
            await TeamMemberRepository.findById(
                id
            );

        if (
            !teamMember ||
            teamMember.isDeleted
        ) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        return teamMember;
    }

    async createTeamMember(
        data: CreateTeamMemberInput,
        userId: string
    ) {
        if (
            data.slug
        ) {
            const exists =
                await TeamMemberRepository.slugExists(
                    data.slug
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        return TeamMemberRepository.create(
            {
                ...data,

                author:
                    new Types.ObjectId(
                        userId
                    ),

                avatar:
                    data.avatar
                        ? new Types.ObjectId(
                            data.avatar
                        )
                        : null,

                gallery:
                    data.gallery?.map(
                        (id) =>
                            new Types.ObjectId(
                                id
                            )
                    ) ?? [],

                createdBy:
                    new Types.ObjectId(
                        userId
                    ),

                updatedBy:
                    new Types.ObjectId(
                        userId
                    ),

                status:
                    data.status ??
                    CONTENT_STATUS.DRAFT,

                employmentStatus:
                    data.employmentStatus ??
                    "active",

                featured:
                    data.featured ??
                    false,

                sortOrder:
                    data.sortOrder ??
                    0,

                isDeleted: false,

                deletedAt: null,
            }
        );
    }

    async updateTeamMember(
        id: string,
        data: UpdateTeamMemberInput,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid team member ID."
            );
        }

        const teamMember =
            await TeamMember.findById(id);

        if (
            !teamMember ||
            teamMember.isDeleted
        ) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        if (
            data.slug &&
            data.slug !==
            teamMember.slug
        ) {
            const exists =
                await TeamMemberRepository.slugExists(
                    data.slug,
                    id
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        if (
            data.avatar !==
            undefined
        ) {
            teamMember.avatar =
                data.avatar
                    ? new Types.ObjectId(
                        data.avatar
                    )
                    : null;
        }

        if (
            data.gallery !==
            undefined
        ) {
            teamMember.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        const {
            avatar,
            gallery,
            ...rest
        } = data;

        Object.assign(
            teamMember,
            rest
        );

        teamMember.updatedBy =
            new Types.ObjectId(
                userId
            );

        await teamMember.save();

        return teamMember;
    }

    async deleteTeamMember(
        id: string
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        if (
            teamMember.isDeleted
        ) {
            throw new ApiError(
                400,
                "Team member already deleted."
            );
        }

        teamMember.isDeleted = true;
        teamMember.deletedAt =
            new Date();

        await teamMember.save();

        return true;
    }

    async restoreTeamMember(
        id: string
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.isDeleted = false;
        teamMember.deletedAt = null;

        await teamMember.save();

        return teamMember;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid team member ID."
            );
        }

        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.status = status;

        await teamMember.save();

        return teamMember;
    }

    async changeEmploymentStatus(
        id: string,
        employmentStatus:
            | "active"
            | "inactive"
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid team member ID."
            );
        }

        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.employmentStatus =
            employmentStatus;

        await teamMember.save();

        return teamMember;
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid team member ID."
            );
        }

        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.featured =
            featured;

        await teamMember.save();

        return teamMember;
    }
}

export default new TeamMemberService();