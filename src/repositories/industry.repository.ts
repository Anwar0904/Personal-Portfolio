import {
    SortOrder,
    Types,
} from "mongoose";

import { Industry } from "@/models/industry.model";
import { IIndustry } from "@/types/industry.types";

class IndustryRepository {
    async create(
        data: Partial<IIndustry>
    ) {
        return Industry.create(data);
    }

    async findById(id: string) {
        return Industry.findById(id)
            .populate(
                "featuredImage"
            )
            .populate(
                "gallery"
            )
            .populate(
                "services",
                "title slug featured"
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
        return Industry.findOne({
            slug,
            isDeleted: false,
        });
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

        return Industry.exists(filter);
    }

    async getIndustries(
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
        return Industry.find(filter)
            .populate(
                "featuredImage"
            )
            .populate(
                "services",
                "title slug"
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

    async countIndustries(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Industry.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IIndustry>
    ) {
        return Industry.findByIdAndUpdate(
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
        return Industry.findByIdAndUpdate(
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
        return Industry.findByIdAndUpdate(
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
        return Industry.findByIdAndUpdate(
            id,
            {
                status,
            },
            {
                new: true,
            }
        );
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        return Industry.findByIdAndUpdate(
            id,
            {
                featured,
            },
            {
                new: true,
            }
        );
    }
}

export default new IndustryRepository();