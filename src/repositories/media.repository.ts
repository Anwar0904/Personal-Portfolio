import { IMedia } from "@/types/media.types";

import { BaseRepository } from "./base.repository";
import { Media } from "@/models/media.model";
import { SortOrder } from "mongoose";


class MediaRepository extends BaseRepository<IMedia> {
    constructor() {
        super(Media);
    }

    async getMedia(
        filter: object,
        page: number,
        limit: number,
        sort: Record<string, SortOrder>
    ) {
        return this.model
            .find(filter)
            .populate("uploadedBy", "name email")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
    }

    async countMedia(filter: object) {
        return this.model.countDocuments(filter);
    }

    async findByPublicId(
        publicId: string
    ) {
        return this.findOne({
            publicId,
        });
    }
}

export default new MediaRepository();