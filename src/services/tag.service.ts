import { SortOrder, Types } from "mongoose";

import { Tag } from "@/models/tag.model";

import { ApiError } from "@/lib/api/api-error";

import TagRepository from "@/repositories/tag.repository";
import { generateSlug } from "@/utils/slugify";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";
import { CreateTagInput, TagQuery, UpdateTagInput } from "@/types/tag.management";


class TagService {
    async getTags(query: TagQuery) {
        const page = Number(query.page ?? 1);

        const limit = Number(query.limit ?? 10);

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$text = {
                $search: query.search,
            };
        }

        if (query.status) {
            filter.status = query.status;
        }

        let sort: Record<string, SortOrder> = {
            createdAt: -1,
        };

        if (query.sort) {
            const field = query.sort.replace(
                "-",
                ""
            );

            const direction =
                query.sort.startsWith("-")
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [tags, total] =
            await Promise.all([
                TagRepository.getTags(
                    filter,
                    page,
                    limit,
                    sort
                ),

                TagRepository.countTags(
                    filter
                ),
            ]);

        return {
            tags,

            pagination: {
                page,

                limit,

                total,

                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    }

    async getTagById(id: string) {
        const tag =
            await Tag.findById(id)
                .populate(
                    "createdBy",
                    "name email"
                )
                .populate(
                    "updatedBy",
                    "name email"
                );

        if (!tag || tag.isDeleted) {
            throw new ApiError(
                404,
                "Tag not found."
            );
        }

        return tag;
    }

    async createTag(
        data: CreateTagInput,
        userId: string
    ) {
        const slug = data.slug
            ? generateSlug(data.slug)
            : generateSlug(data.name);

        const exists = await TagRepository.slugExists(slug);

        if (exists) {
            throw new ApiError(
                409,
                "Tag already exists."
            );
        }

        return TagRepository.create({
            ...data,

            color:
                data.color ??
                "#3B82F6",

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateTag(
        id: string,
        data: UpdateTagInput,
        userId: string
    ) {
        const tag = await Tag.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!tag) {
            throw new ApiError(
                404,
                "Tag not found."
            );
        }

        const updateData = {
            ...data,
        };

        if (data.name || data.slug) {
            const nextSlug = generateSlug(
                data.slug || data.name!
            );

            const exists =
                await TagRepository.slugExists(
                    nextSlug,
                    id
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "A tag with this slug already exists."
                );
            }

            updateData.slug = nextSlug;
        }

        Object.assign(
            tag,
            updateData
        );

        tag.updatedBy =
            new Types.ObjectId(userId);

        await tag.save();

        return tag;
    }

    async deleteTag(id: string) {
        const tag =
            await Tag.findById(id);

        if (!tag) {
            throw new ApiError(
                404,
                "Tag not found."
            );
        }

        if (tag.isDeleted) {
            throw new ApiError(
                400,
                "Tag already deleted."
            );
        }

        tag.isDeleted = true;

        tag.deletedAt = new Date();

        await tag.save();

        return true;
    }

    async restoreTag(id: string) {
        const tag =
            await Tag.findById(id);

        if (!tag) {
            throw new ApiError(
                404,
                "Tag not found."
            );
        }

        tag.isDeleted = false;

        tag.deletedAt = null;

        await tag.save();

        return tag;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const tag =
            await Tag.findById(id);

        if (!tag) {
            throw new ApiError(
                404,
                "Tag not found."
            );
        }

        tag.status = status;

        await tag.save();

        return tag;
    }
}

export default new TagService();