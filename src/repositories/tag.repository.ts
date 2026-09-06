import { SortOrder } from "mongoose";

import { BaseRepository } from "./base.repository";

import { Tag } from "@/models/tag.model";
import { ITag } from "@/types/tag.types";

class TagRepository extends BaseRepository<ITag> {
    constructor() {
        super(Tag);
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

        return this.exists(filter);
    }

    async getTags(
        filter: Record<string, unknown>,
        page: number,
        limit: number,
        sort: Record<string, SortOrder>
    ) {
        return this.model
            .find(filter)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
    }

    async countTags(
        filter: Record<string, unknown>
    ) {
        return this.model.countDocuments(filter);
    }
}

export default new TagRepository();