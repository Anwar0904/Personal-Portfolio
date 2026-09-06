import { SortOrder } from "mongoose";

import { Category } from "@/models/category.model";
import { ICategory } from "@/types/category.types";

import { BaseRepository } from "./base.repository";

class CategoryRepository extends BaseRepository<ICategory> {
    constructor() {
        super(Category);
    }

    async getCategories(
        filter: Record<string, unknown>,
        page: number,
        limit: number,
        sort: Record<string, SortOrder>
    ) {
        return this.model
            .find(filter)
            .populate("parent", "name slug")
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
    }

    async countCategories(
        filter: Record<string, unknown>
    ) {
        return this.model.countDocuments(filter);
    }

    async findBySlug(slug: string) {
        return this.model.findOne({
            slug,
            isDeleted: false,
        });
    }

    async slugExists(
        slug: string,
        excludeId?: string
    ) {
        const filter: Record<string, unknown> = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne: excludeId,
            };
        }

        return this.model.exists(filter);
    }

    async findRootCategories() {
        return this.model.find({
            parent: null,
            isDeleted: false,
        });
    }

    async findChildren(
        parentId: string
    ) {
        return this.model.find({
            parent: parentId,
            isDeleted: false,
        });
    }
}

export default new CategoryRepository();