import {
    SortOrder,
    Types,
} from "mongoose";

import { Blog } from "@/models/blog.model";
import { IBlog } from "@/types/blog.types";

class BlogRepository {
    private populateQuery(query: any) {
        return query
            .populate(
                "category",
                "name slug"
            )
            .populate(
                "tags",
                "name slug color"
            )
            .populate(
                "author",
                "firstName lastName email avatar jobTitle"
            )
            .populate(
                "featuredImage"
            )
            .populate(
                "gallery"
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

    async create(
        data: Partial<IBlog>
    ) {
        const blog =
            await Blog.create(data);

        return this.findById(
            blog._id.toString()
        );
    }

    async findById(
        id: string
    ) {
        return this.populateQuery(
            Blog.findById(id)
        );
    }

    async findBySlug(
        slug: string
    ) {
        return this.populateQuery(
            Blog.findOne({
                slug,
                isDeleted: false,
                status: "published",
            })
        );
    }

    async findAdminBySlug(
        slug: string
    ) {
        return this.populateQuery(
            Blog.findOne({
                slug,
                isDeleted: false,
            })
        );
    }

    async slugExists(
        slug: string,
        excludeId?: string
    ) {
        const filter: Record<
            string,
            unknown
        > = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne:
                    new Types.ObjectId(
                        excludeId
                    ),
            };
        }

        return Blog.exists(filter);
    }

    async getBlogs(
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
        return this.populateQuery(
            Blog.find(filter)
                .sort(sort)
                .skip(
                    (page - 1) *
                    limit
                )
                .limit(limit)
        );
    }

    async countBlogs(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Blog.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IBlog>
    ) {
        return this.findByIdAndUpdate(
            id,
            data
        );
    }

    async findByIdAndUpdate(
        id: string,
        data: Partial<IBlog>
    ) {
        return this.populateQuery(
            Blog.findByIdAndUpdate(
                id,
                data,
                {
                    new: true,
                    runValidators: true,
                }
            )
        );
    }

    async delete(
        id: string
    ) {
        return this.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt:
                    new Date(),
            }
        );
    }

    async restore(
        id: string
    ) {
        return this.findByIdAndUpdate(
            id,
            {
                isDeleted: false,
                deletedAt: null,
            }
        );
    }

    async changeStatus(
        id: string,
        status: string
    ) {
        return this.findByIdAndUpdate(
            id,
            {
                status: status as IBlog["status"],
            }
        );
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        return this.findByIdAndUpdate(
            id,
            {
                featured,
            }
        );
    }

    async incrementViews(
        id: string
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                $inc: {
                    views: 1,
                },
            }
        );
    }
}

export default new BlogRepository();