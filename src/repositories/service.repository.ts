import {
    SortOrder,
    Types,
} from "mongoose";

import { Service } from "@/models/service.model";
import { IService } from "@/types/service.types";

class ServiceRepository {
    async create(
        data: Partial<IService>
    ) {
        return Service.create(data);
    }

    async findById(id: string) {
        return Service.findById(id)
            .populate(
                "featuredImage"
            )
            .populate(
                "gallery"
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
        return Service.findOne({
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

        return Service.exists(filter);
    }

    async getServices(
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
        return Service.find(filter)
            .populate(
                "author",
                "name"
            )
            .populate(
                "featuredImage"
            )
            .sort(sort)
            .skip(
                (page - 1) * limit
            )
            .limit(limit);
    }

    async countServices(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Service.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IService>
    ) {
        return Service.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string) {
        return Service.findByIdAndUpdate(
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

    async restore(id: string) {
        return Service.findByIdAndUpdate(
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
        return Service.findByIdAndUpdate(
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
        return Service.findByIdAndUpdate(
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

export default new ServiceRepository();