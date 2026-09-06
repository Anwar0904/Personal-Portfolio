import {
    SortOrder,
    Types,
} from "mongoose";

import FAQRepository from "@/repositories/faq.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateFAQInput,
    FAQQuery,
    UpdateFAQInput,
} from "@/types/faq-management";

class FAQService {
    async getFAQs(
        query: FAQQuery
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
            filter.$or = [
                {
                    question: {
                        $regex:
                            query.search,
                        $options:
                            "i",
                    },
                },
                {
                    answer: {
                        $regex:
                            query.search,
                        $options:
                            "i",
                    },
                },
            ];
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        let sort: Record<
            string,
            SortOrder
        > = {
            sortOrder: 1,
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
            faqs,
            total,
        ] = await Promise.all([
            FAQRepository.getFAQs(
                filter,
                page,
                limit,
                sort
            ),
            FAQRepository.countFAQs(
                filter
            ),
        ]);

        return {
            faqs,

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

    async getFAQById(
        id: string
    ) {
        const faq =
            await FAQRepository.findById(
                id
            );

        if (
            !faq ||
            faq.isDeleted
        ) {
            throw new ApiError(
                404,
                "FAQ not found."
            );
        }

        return faq;
    }

    async createFAQ(
        data: CreateFAQInput,
        userId: string
    ) {
        return FAQRepository.create({
            ...data,

            status:
                data.status ??
                CONTENT_STATUS.DRAFT,

            sortOrder:
                data.sortOrder ?? 0,

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateFAQ(
        id: string,
        data: UpdateFAQInput,
        userId: string
    ) {
        const faq =
            await FAQRepository.findById(
                id
            );

        if (
            !faq ||
            faq.isDeleted
        ) {
            throw new ApiError(
                404,
                "FAQ not found."
            );
        }

        return FAQRepository.update(
            id,
            {
                ...data,

                updatedBy:
                    new Types.ObjectId(userId),
            }
        );
    }

    async deleteFAQ(
        id: string
    ) {
        const faq =
            await FAQRepository.findById(
                id
            );

        if (
            !faq ||
            faq.isDeleted
        ) {
            throw new ApiError(
                404,
                "FAQ not found."
            );
        }

        return FAQRepository.update(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            }
        );
    }

    async restoreFAQ(
        id: string
    ) {
        const faq =
            await FAQRepository.findById(id);

        if (!faq) {
            throw new ApiError(
                404,
                "FAQ not found."
            );
        }

        if (!faq.isDeleted) {
            throw new ApiError(
                400,
                "FAQ is not deleted."
            );
        }

        return FAQRepository.update(
            id,
            {
                isDeleted: false,
                deletedAt: null,
            }
        );
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const faq =
            await FAQRepository.findById(id);

        if (
            !faq ||
            faq.isDeleted
        ) {
            throw new ApiError(
                404,
                "FAQ not found."
            );
        }

        return FAQRepository.update(
            id,
            {
                status,
            }
        );
    }
}

const faqService = new FAQService();

export default faqService;
