import {
    SortOrder,
    Types,
} from "mongoose";

import { Industry } from "@/models/industry.model";

import IndustryRepository from "@/repositories/industry.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateIndustryInput,
    UpdateIndustryInput,
    IndustryQuery,
} from "@/types/industry-management";
import { generateSlug } from "@/utils/slugify";

class IndustryService {
    async getIndustries(
        query: IndustryQuery
    ) {
        const page = Number(
            query.page ?? 1
        );

        const limit = Number(
            query.limit ?? 10
        );

        const filter: Record<
            string,
            unknown
        > = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$text = {
                $search: query.search,
            };
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        if (query.author) {
            filter.author =
                new Types.ObjectId(
                    query.author
                );
        }

        if (query.service) {
            filter.services = {
                $in: [
                    new Types.ObjectId(
                        query.service
                    ),
                ],
            };
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
                query.sort.replace(
                    "-",
                    ""
                );

            sort = {
                [field]:
                    query.sort.startsWith(
                        "-"
                    )
                        ? -1
                        : 1,
            };
        }

        const [
            industries,
            total,
        ] = await Promise.all([
            IndustryRepository.getIndustries(
                filter,
                page,
                limit,
                sort
            ),

            IndustryRepository.countIndustries(
                filter
            ),
        ]);

        return {
            industries,

            pagination: {
                page,

                limit,

                total,

                totalPages:
                    Math.ceil(
                        total /
                        limit
                    ),
            },
        };
    }

    async getIndustryById(
        id: string
    ) {
        const industry =
            await IndustryRepository.findById(
                id
            );

        if (
            !industry ||
            industry.isDeleted
        ) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        return industry;
    }

    async createIndustry(
        data: CreateIndustryInput,
        userId: string
    ) {
        const slug = generateSlug(data.title);

        const exists =
            await IndustryRepository.slugExists(
                slug
            );

        if (exists) {
            throw new ApiError(
                409,
                "Slug already exists."
            );
        }

        return IndustryRepository.create({
            ...data,

            slug,

            author: new Types.ObjectId(userId),

            featuredImage: data.featuredImage
                ? new Types.ObjectId(data.featuredImage)
                : null,

            gallery:
                data.gallery?.map(
                    (id) => new Types.ObjectId(id)
                ) ?? [],

            services:
                data.services?.map(
                    (id) => new Types.ObjectId(id)
                ) ?? [],

            status:
                data.status ??
                CONTENT_STATUS.DRAFT,

            featured:
                data.featured ??
                false,

            sortOrder:
                data.sortOrder ??
                0,

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateIndustry(
        id: string,
        data: UpdateIndustryInput,
        userId: string
    ) {
        const industry =
            await Industry.findById(id);

        if (
            !industry ||
            industry.isDeleted
        ) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        if (data.title) {
            const slug =
                generateSlug(data.title);

            if (slug !== industry.slug) {
                const exists =
                    await IndustryRepository.slugExists(
                        slug,
                        id
                    );

                if (exists) {
                    throw new ApiError(
                        409,
                        "Slug already exists."
                    );
                }
            }

            industry.slug = slug;
        }

        Object.assign(
            industry,
            data
        );

        if (
            data.featuredImage !== undefined
        ) {
            industry.featuredImage =
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null;
        }

        if (data.gallery) {
            industry.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(id)
                );
        }

        if (data.services) {
            industry.services =
                data.services.map(
                    (id) =>
                        new Types.ObjectId(id)
                );
        }

        industry.updatedBy =
            new Types.ObjectId(userId);

        await industry.save();

        return industry;
    }

    async deleteIndustry(
        id: string
    ) {
        const industry =
            await Industry.findById(
                id
            );

        if (!industry) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        if (
            industry.isDeleted
        ) {
            throw new ApiError(
                400,
                "Industry already deleted."
            );
        }

        industry.isDeleted = true;

        industry.deletedAt =
            new Date();

        await industry.save();

        return true;
    }

    async restoreIndustry(
        id: string
    ) {
        const industry =
            await Industry.findById(
                id
            );

        if (!industry) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        industry.isDeleted = false;

        industry.deletedAt = null;

        await industry.save();

        return industry;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const industry =
            await Industry.findById(
                id
            );

        if (!industry) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        industry.status =
            status;

        await industry.save();

        return industry;
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        const industry =
            await Industry.findById(
                id
            );

        if (!industry) {
            throw new ApiError(
                404,
                "Industry not found."
            );
        }

        industry.featured =
            featured;

        await industry.save();

        return industry;
    }
}

export default new IndustryService();