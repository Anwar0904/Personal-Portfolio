import mongoose, { SortOrder, Types } from "mongoose";

import { Category } from "@/models/category.model";

import { ApiError } from "@/lib/api/api-error";

import CategoryRepository from "@/repositories/category.repository";

import { CONTENT_STATUS, ContentStatus } from "@/enums";

import {
    CategoryQuery,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "@/types/category-management";

class CategoryService {

    async getCategories(query: CategoryQuery) {

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

        if (query.parent) {
            filter.parent =
                new Types.ObjectId(query.parent);
        }

        let sort: Record<string, SortOrder> = {
            createdAt: -1,
        };

        if (query.sort) {

            const field =
                query.sort.replace("-", "");

            const direction =
                query.sort.startsWith("-")
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [categories, total] =
            await Promise.all([
                CategoryRepository.getCategories(
                    filter,
                    page,
                    limit,
                    sort
                ),
                CategoryRepository.countCategories(
                    filter
                ),
            ]);

        return {
            categories,

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

    async getCategoryById(id: string) {

        const category =
            await Category.findById(id)
                .populate("parent", "name slug")
                .populate("createdBy", "name email")
                .populate("updatedBy", "name email");

        if (!category || category.isDeleted) {
            throw new ApiError(
                404,
                "Category not found."
            );
        }

        return category;
    }

    async createCategory(
        data: CreateCategoryInput,
        userId: string
    ) {

        if (data.slug) {

            const exists =
                await CategoryRepository.slugExists(
                    data.slug
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        return Category.create({

            ...data,

            parent: data.parent
                ? new Types.ObjectId(data.parent)
                : null,

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateCategory(
        id: string,
        data: UpdateCategoryInput,
        userId: string
    ) {

        const category =
            await Category.findById(id);

        if (!category || category.isDeleted) {
            throw new ApiError(
                404,
                "Category not found."
            );
        }

        if (
            data.slug &&
            data.slug !== category.slug
        ) {

            const exists =
                await CategoryRepository.slugExists(
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

        Object.assign(category, data);

        if (data.parent !== undefined) {

            category.parent =
                data.parent
                    ? new Types.ObjectId(
                        data.parent
                    )
                    : null;
        }

        category.updatedBy =
            new Types.ObjectId(userId);

        await category.save();

        return category;
    }

    async deleteCategory(id: string) {

        const category =
            await Category.findById(id);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found."
            );
        }

        if (category.isDeleted) {
            throw new ApiError(
                400,
                "Category already deleted."
            );
        }

        category.isDeleted = true;

        category.deletedAt = new Date();

        await category.save();

        return true;
    }

    async restoreCategory(id: string) {

        const category =
            await Category.findById(id);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found."
            );
        }

        category.isDeleted = false;

        category.deletedAt = null;

        await category.save();

        return category;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {

        const category =
            await Category.findById(id);

        if (!category) {
            throw new ApiError(
                404,
                "Category not found."
            );
        }

        category.status = status;

        await category.save();

        return category;
    }
}

export default new CategoryService();