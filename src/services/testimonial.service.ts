import {
    SortOrder,
    Types,
} from "mongoose";

import { Testimonial } from "@/models/testimonial.model";

import TestimonialRepository from "@/repositories/testimonial.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateTestimonialInput,
    UpdateTestimonialInput,
    TestimonialQuery,
} from "@/types/testimonial-management";

class TestimonialService {
    async getTestimonials(
        query: TestimonialQuery
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
            filter.service =
                new Types.ObjectId(
                    query.service
                );
        }

        if (query.portfolio) {
            filter.portfolio =
                new Types.ObjectId(
                    query.portfolio
                );
        }

        if (query.industry) {
            filter.industry =
                new Types.ObjectId(
                    query.industry
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
            testimonials,
            total,
        ] = await Promise.all([
            TestimonialRepository.getTestimonials(
                filter,
                page,
                limit,
                sort
            ),

            TestimonialRepository.countTestimonials(
                filter
            ),
        ]);

        return {
            testimonials,

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

    async getTestimonialById(
        id: string
    ) {
        const testimonial =
            await TestimonialRepository.findById(
                id
            );

        if (
            !testimonial ||
            testimonial.isDeleted
        ) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        return testimonial;
    }

    async createTestimonial(
        data: CreateTestimonialInput,
        userId: string
    ) {
        return TestimonialRepository.create(
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

                service:
                    data.service
                        ? new Types.ObjectId(
                            data.service
                        )
                        : null,

                portfolio:
                    data.portfolio
                        ? new Types.ObjectId(
                            data.portfolio
                        )
                        : null,

                industry:
                    data.industry
                        ? new Types.ObjectId(
                            data.industry
                        )
                        : null,

                status:
                    (data.status ??
                        CONTENT_STATUS.PUBLISHED) as ContentStatus,

                featured:
                    data.featured ??
                    false,

                sortOrder:
                    data.sortOrder ??
                    0,

                createdBy:
                    new Types.ObjectId(
                        userId
                    ),

                updatedBy:
                    new Types.ObjectId(
                        userId
                    ),

                isDeleted: false,

                deletedAt: null,
            }
        );
    }

    async updateTestimonial(
        id: string,
        data: UpdateTestimonialInput,
        userId: string
    ) {
        const testimonial =
            await Testimonial.findById(
                id
            );

        if (
            !testimonial ||
            testimonial.isDeleted
        ) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        Object.assign(
            testimonial,
            data
        );

        if (
            data.avatar !==
            undefined
        ) {
            testimonial.avatar =
                data.avatar
                    ? new Types.ObjectId(
                        data.avatar
                    )
                    : null;
        }

        if (
            data.service !==
            undefined
        ) {
            testimonial.service =
                data.service
                    ? new Types.ObjectId(
                        data.service
                    )
                    : null;
        }

        if (
            data.portfolio !==
            undefined
        ) {
            testimonial.portfolio =
                data.portfolio
                    ? new Types.ObjectId(
                        data.portfolio
                    )
                    : null;
        }

        if (
            data.industry !==
            undefined
        ) {
            testimonial.industry =
                data.industry
                    ? new Types.ObjectId(
                        data.industry
                    )
                    : null;
        }

        testimonial.updatedBy =
            new Types.ObjectId(
                userId
            );

        await testimonial.save();

        return testimonial;
    }

    async deleteTestimonial(
        id: string
    ) {
        const testimonial =
            await Testimonial.findById(
                id
            );

        if (!testimonial) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        if (
            testimonial.isDeleted
        ) {
            throw new ApiError(
                400,
                "Testimonial already deleted."
            );
        }

        testimonial.isDeleted = true;

        testimonial.deletedAt =
            new Date();

        await testimonial.save();

        return true;
    }

    async restoreTestimonial(
        id: string
    ) {
        const testimonial =
            await Testimonial.findById(
                id
            );

        if (!testimonial) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        testimonial.isDeleted = false;

        testimonial.deletedAt = null;

        await testimonial.save();

        return testimonial;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const testimonial =
            await Testimonial.findById(
                id
            );

        if (!testimonial) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        testimonial.status =
            status;

        await testimonial.save();

        return testimonial;
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        const testimonial =
            await Testimonial.findById(
                id
            );

        if (!testimonial) {
            throw new ApiError(
                404,
                "Testimonial not found."
            );
        }

        testimonial.featured =
            featured;

        await testimonial.save();

        return testimonial;
    }
}

export default new TestimonialService();