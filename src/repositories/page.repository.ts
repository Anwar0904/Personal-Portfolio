import {
    SortOrder,
    Types,
} from "mongoose";

import { Page } from "@/models/page.model";

import "@/models/media.model";
import "@/models/user.model";

import { IPage } from "@/types/page.types";

class PageRepository {
    async create(
        data: Partial<IPage>
    ) {
        return Page.create(data);
    }

    async findById(
        id: string
    ) {
        return Page.findById(id)
            .populate(
                "featuredImage"
            )
            .populate(
                "author",
                "name email avatar"
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

    async findBySlug(
        slug: string
    ) {
        return Page.findOne({
            slug,
            isDeleted: false,
        })
            .populate(
                "featuredImage"
            )
            .populate(
                "author",
                "name email avatar"
            );
    }

    async getHomePage() {
        return Page.findOne({
            isHomePage: true,
            status: "published",
            isDeleted: false,
        }).populate(
            "featuredImage"
        );
    }

    async slugExists(
        slug: string,
        excludeId?: string
    ) {
        const filter: {
            slug: string;
            isDeleted: boolean;
            _id?: {
                $ne: Types.ObjectId;
            };
        } = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne: new Types.ObjectId(
                    excludeId
                ),
            };
        }

        return Page.exists(filter);
    }

    async getPages(
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
        return Page.find(filter)
            .populate(
                "featuredImage"
            )
            .populate(
                "author",
                "name"
            )
            .sort(sort)
            .skip(
                (page - 1) * limit
            )
            .limit(limit);
    }

    async countPages(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Page.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IPage>
    ) {
        return Page.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(
        id: string
    ) {
        return Page.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async restore(
        id: string
    ) {
        return Page.findByIdAndUpdate(
            id,
            {
                isDeleted: false,
                deletedAt: null,
            },
            {
                new: true,
            }
        );
    }

    async changeStatus(
        id: string,
        status: string
    ) {
        return Page.findByIdAndUpdate(
            id,
            {
                status,
            },
            {
                new: true,
            }
        );
    }

    async setHomePage(
        id: string
    ) {
        await Page.updateMany(
            {},
            {
                isHomePage: false,
            }
        );

        return Page.findByIdAndUpdate(
            id,
            {
                isHomePage: true,
            },
            {
                new: true,
            }
        );
    }
}

export default new PageRepository();