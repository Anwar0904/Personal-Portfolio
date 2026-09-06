import {
    SortOrder,
    Types,
} from "mongoose";

import { Page } from "@/models/page.model";

import PageRepository from "@/repositories/page.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreatePageInput,
    UpdatePageInput,
    PageQuery,
} from "@/types/page-management";

class PageService {
    async getPages(
        query: PageQuery
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
                $search:
                    query.search,
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

        if (
            query.isHomePage !==
            undefined
        ) {
            filter.isHomePage =
                query.isHomePage;
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
            pages,
            total,
        ] = await Promise.all([
            PageRepository.getPages(
                filter,
                page,
                limit,
                sort
            ),

            PageRepository.countPages(
                filter
            ),
        ]);

        return {
            pages,

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

    async getPageById(
        id: string
    ) {
        const page =
            await PageRepository.findById(
                id
            );

        if (
            !page ||
            page.isDeleted
        ) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        return page;
    }

    async getHomePage() {
        const page =
            await PageRepository.getHomePage();

        if (!page) {
            throw new ApiError(
                404,
                "Homepage not found."
            );
        }

        return page;
    }

    async createPage(
        data: CreatePageInput,
        userId: string
    ) {
        if (
            "slug" in data &&
            typeof data.slug ===
            "string" &&
            data.slug.length > 0
        ) {
            const exists =
                await PageRepository.slugExists(
                    data.slug
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        if (
            data.isHomePage
        ) {
            await Page.updateMany(
                {},
                {
                    isHomePage:
                        false,
                }
            );
        }

        return PageRepository.create({
            ...data,

            author:
                new Types.ObjectId(
                    userId
                ),

            featuredImage:
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null,

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            createdBy:
                new Types.ObjectId(
                    userId
                ),

            updatedBy:
                new Types.ObjectId(
                    userId
                ),

            isDeleted:
                false,

            deletedAt:
                null,
        });
    }

    async updatePage(
        id: string,
        data: UpdatePageInput,
        userId: string
    ) {
        const page =
            await Page.findById(
                id
            );

        if (
            !page ||
            page.isDeleted
        ) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        if (
            "slug" in data &&
            typeof data.slug ===
            "string" &&
            data.slug.length > 0 &&
            data.slug !==
            page.slug
        ) {
            const exists =
                await PageRepository.slugExists(
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

        Object.assign(
            page,
            data
        );

        if (
            data.featuredImage !==
            undefined
        ) {
            page.featuredImage =
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null;
        }

        if (
            data.isHomePage
        ) {
            await Page.updateMany(
                {},
                {
                    isHomePage:
                        false,
                }
            );

            page.isHomePage =
                true;
        }

        page.updatedBy =
            new Types.ObjectId(
                userId
            );

        await page.save();

        return page;
    }

    async deletePage(
        id: string
    ) {
        const page =
            await Page.findById(
                id
            );

        if (!page) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        if (
            page.isDeleted
        ) {
            throw new ApiError(
                400,
                "Page already deleted."
            );
        }

        page.isDeleted =
            true;

        page.deletedAt =
            new Date();

        await page.save();

        return true;
    }

    async restorePage(
        id: string
    ) {
        const page =
            await Page.findById(
                id
            );

        if (!page) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        page.isDeleted =
            false;

        page.deletedAt =
            null;

        await page.save();

        return page;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const page =
            await Page.findById(
                id
            );

        if (!page) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        page.status =
            status;

        await page.save();

        return page;
    }

    async setHomePage(
        id: string
    ) {
        const page =
            await Page.findById(
                id
            );

        if (!page) {
            throw new ApiError(
                404,
                "Page not found."
            );
        }

        await Page.updateMany(
            {},
            {
                isHomePage:
                    false,
            }
        );

        page.isHomePage =
            true;

        await page.save();

        return page;
    }


}

export default new PageService();