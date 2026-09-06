import mongoose, {
    SortOrder,
    Types,
} from "mongoose";



import { ApiError } from "@/lib/api/api-error";

import MediaRepository from "@/repositories/media.repository";

import { ContentStatus } from "@/enums";

import { IMedia } from "@/types/media.types";

import {
    CreateMediaInput,
    UpdateMediaInput,
    MediaQuery,
} from "@/types/media-management";

class MediaService {

    async getMedia(query: MediaQuery) {

        const page = Number(query.page ?? 1);

        const limit = Number(query.limit ?? 10);

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$or = [
                {
                    fileName: {
                        $regex: query.search,
                        $options: "i",
                    },
                },
                {
                    alt: {
                        $regex: query.search,
                        $options: "i",
                    },
                },
                {
                    caption: {
                        $regex: query.search,
                        $options: "i",
                    },
                },
            ];
        }

        if (query.mediaType) {
            filter.mediaType = query.mediaType;
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (query.folder) {
            filter.folder = query.folder;
        }

        let sort: Record<string, SortOrder> = {
            createdAt: -1,
        };

        if (query.sort) {

            const field =
                query.sort.replace("-", "");

            const direction: SortOrder =
                query.sort.startsWith("-")
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [media, total] =
            await Promise.all([
                MediaRepository.getMedia(
                    filter,
                    page,
                    limit,
                    sort
                ),

                MediaRepository.countMedia(
                    filter
                ),
            ]);

        return {
            media,

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

    async getMediaById(id: string) {

        const media =
            await MediaRepository.findById(id);

        if (!media || media.isDeleted) {
            throw new ApiError(
                404,
                "Media not found."
            );
        }

        return media.populate(
            "uploadedBy",
            "name email"
        );
    }

    async createMedia(
        data: CreateMediaInput,
        userId: string
    ) {

        return MediaRepository.create({

            ...data,

            uploadedBy:
                new Types.ObjectId(userId),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateMedia(
        id: string,
        data: UpdateMediaInput,
    ) {

        const media =
            await MediaRepository.findById(id);

        if (!media || media.isDeleted) {
            throw new ApiError(
                404,
                "Media not found."
            );
        }

        Object.assign(media, data);

        await media.save();

        return media;
    }

    async deleteMedia(id: string) {

        const media =
            await MediaRepository.findById(id);

        if (!media || media.isDeleted) {
            throw new ApiError(
                404,
                "Media not found."
            );
        }

        media.isDeleted = true;

        media.deletedAt = new Date();

        await media.save();

        return true;
    }

    async restoreMedia(id: string) {

        const media =
            await MediaRepository.findById(id);

        if (!media) {
            throw new ApiError(
                404,
                "Media not found."
            );
        }

        media.isDeleted = false;

        media.deletedAt = null;

        await media.save();

        return media;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {

        const media =
            await MediaRepository.findById(id);

        if (!media || media.isDeleted) {
            throw new ApiError(
                404,
                "Media not found."
            );
        }

        media.status = status;

        await media.save();

        return media;
    }
}

export default new MediaService();