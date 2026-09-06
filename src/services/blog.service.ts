import {
    SortOrder,
    Types,
} from "mongoose";

import {
    ApiError,
} from "@/lib/api/api-error";

import BlogRepository from "@/repositories/blog.repository";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateBlogInput,
    UpdateBlogInput,
    BlogQuery,
} from "@/types/blog.management";

import {
    IBlog,
} from "@/types/blog.types";

import {
    generateSlug,
} from "@/utils/slugify";

class BlogService {
    private ensureObjectId(
        id: string,
        message = "Invalid blog ID."
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                message
            );
        }
    }

    async getBlogs(
        query: BlogQuery
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

        if (query.search) {
            filter.$text = {
                $search:
                    query.search,
            };
        }

        if (query.category) {
            filter.category =
                new Types.ObjectId(
                    query.category
                );
        }

        if (query.author) {
            filter.author =
                new Types.ObjectId(
                    query.author
                );
        }

        if (query.tag) {
            filter.tags = {
                $in: [
                    new Types.ObjectId(
                        query.tag
                    ),
                ],
            };
        }

        if (query.status) {
            filter.status =
                query.status;
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
                    /^-/,
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
            blogs,
            total,
        ] = await Promise.all([
            BlogRepository.getBlogs(
                filter,
                page,
                limit,
                sort
            ),
            BlogRepository.countBlogs(
                filter
            ),
        ]);

        return {
            blogs,
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

    async getBlogById(
        id: string
    ) {
        this.ensureObjectId(id);

        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        return blog;
    }

    async getBlogBySlug(
        slug: string
    ) {
        const blog =
            await BlogRepository.findBySlug(
                slug
            );

        if (!blog) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        await BlogRepository.incrementViews(
            blog._id.toString()
        );

        blog.views += 1;

        return blog;
    }

    async createBlog(
        data: CreateBlogInput,
        userId: string
    ) {
        const slug =
            data.slug
                ? generateSlug(data.slug)
                : generateSlug(data.title);

        const exists =
            await BlogRepository.slugExists(
                slug
            );

        if (exists) {
            throw new ApiError(
                409,
                "Slug already exists."
            );
        }

        const isPublished =
            data.status ===
            CONTENT_STATUS.PUBLISHED;

        return BlogRepository.create({
            title: data.title,

            slug,

            excerpt: data.excerpt,

            content: data.content,

            category:
                new Types.ObjectId(
                    data.category
                ),

            tags:
                data.tags?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

            /*
             * IMPORTANT:
             * Author is ALWAYS the authenticated user.
             */
            author:
                new Types.ObjectId(userId),

            featuredImage:
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null,

            gallery:
                data.gallery?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

            seo: data.seo,

            faqs: data.faqs ?? [],

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            featured:
                data.featured ?? false,

            views: 0,

            readingTime: Math.max(
                1,
                Math.ceil(
                    data.content
                        .split(/\s+/)
                        .filter(Boolean)
                        .length / 200
                )
            ),

            publishedAt:
                isPublished
                    ? data.publishedAt
                        ? new Date(
                            data.publishedAt
                        )
                        : new Date()
                    : null,

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateBlog(
        id: string,
        data: UpdateBlogInput,
        userId: string
    ) {
        this.ensureObjectId(id);
        this.ensureObjectId(
            userId,
            "Invalid user ID."
        );

        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        let slug =
            blog.slug;

        if (
            data.slug ||
            data.title
        ) {
            slug =
                generateSlug(
                    data.slug ??
                    data.title ??
                    blog.slug
                );

            const exists =
                await BlogRepository.slugExists(
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

        const update: Partial<IBlog> =
            {};

        if (
            data.title !==
            undefined
        ) {
            update.title =
                data.title;
        }

        update.slug = slug;

        if (
            data.excerpt !==
            undefined
        ) {
            update.excerpt =
                data.excerpt;
        }

        if (
            data.content !==
            undefined
        ) {
            update.content =
                data.content;

            update.readingTime =
                this.calculateReadingTime(
                    data.content
                );
        }

        if (
            data.category !==
            undefined
        ) {
            update.category =
                new Types.ObjectId(
                    data.category
                );
        }


        if (
            data.featuredImage !==
            undefined
        ) {
            update.featuredImage =
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null;
        }

        if (
            data.gallery !==
            undefined
        ) {
            update.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            data.tags !==
            undefined
        ) {
            update.tags =
                data.tags.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            data.seo !==
            undefined
        ) {
            update.seo =
                data.seo;
        }

        if (
            data.faqs !==
            undefined
        ) {
            update.faqs =
                data.faqs;
        }

        if (
            data.featured !==
            undefined
        ) {
            update.featured =
                data.featured;
        }

        if (
            data.status !==
            undefined
        ) {
            update.status =
                data.status as ContentStatus;

            if (
                data.status ===
                CONTENT_STATUS.PUBLISHED
            ) {
                update.publishedAt =
                    data.publishedAt
                        ? new Date(
                            data.publishedAt
                        )
                        : blog.publishedAt ??
                        new Date();
            }

            if (
                data.status !==
                CONTENT_STATUS.PUBLISHED
            ) {
                update.publishedAt =
                    null;
            }
        } else if (
            data.publishedAt !==
            undefined
        ) {
            update.publishedAt =
                data.publishedAt
                    ? new Date(
                        data.publishedAt
                    )
                    : null;
        }

        update.updatedBy =
            new Types.ObjectId(
                userId
            );

        return BlogRepository.update(
            id,
            update
        );
    }

    async deleteBlog(
        id: string
    ) {
        this.ensureObjectId(id);

        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        return BlogRepository.delete(
            id
        );
    }

    async restoreBlog(
        id: string
    ) {
        this.ensureObjectId(id);

        const blog =
            await BlogRepository.findById(
                id
            );

        if (!blog) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        if (!blog.isDeleted) {
            throw new ApiError(
                400,
                "Blog is not deleted."
            );
        }

        return BlogRepository.restore(
            id
        );
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        this.ensureObjectId(id);

        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        if (
            status ===
            CONTENT_STATUS.PUBLISHED
        ) {
            return BlogRepository.changeStatus(
                id,
                status
            );
        }

        return BlogRepository.update(
            id,
            {
                status,
                publishedAt: null,
            }
        );
    }

    async toggleFeatured(
        id: string
    ) {
        this.ensureObjectId(id);

        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        return BlogRepository.toggleFeatured(
            id,
            !blog.featured
        );
    }

    async incrementViews(
        id: string
    ) {
        this.ensureObjectId(id);

        await BlogRepository.incrementViews(
            id
        );
    }

    private calculateReadingTime(
        content: string
    ) {
        const words =
            content
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;

        return Math.max(
            1,
            Math.ceil(
                words / 200
            )
        );
    }
}

export default new BlogService();