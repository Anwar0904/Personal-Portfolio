import { SortOrder, Types } from "mongoose";

import { Service } from "@/models/service.model";

import ServiceRepository from "@/repositories/service.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateServiceInput,
    UpdateServiceInput,
    ServiceQuery,
} from "@/types/service-management";

class ServiceService {
    async getServices(query: ServiceQuery) {
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

        if (query.author) {
            filter.author = new Types.ObjectId(
                query.author
            );
        }

        if (
            query.featured !== undefined
        ) {
            filter.featured =
                query.featured;
        }

        let sort: Record<
            string,
            SortOrder
        > = {
            createdAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.replace(
                    "-",
                    ""
                );

            sort = {
                [field]:
                    query.sort.startsWith(
                        "-"
                    )
                        ? -1
                        : 1,
            };
        }

        const [services, total] =
            await Promise.all([
                ServiceRepository.getServices(
                    filter,
                    page,
                    limit,
                    sort
                ),

                ServiceRepository.countServices(
                    filter
                ),
            ]);

        return {
            services,

            pagination: {
                page,

                limit,

                total,

                totalPages:
                    Math.ceil(
                        total / limit
                    ),
            },
        };
    }

    async getServiceById(
        id: string
    ) {
        const service =
            await ServiceRepository.findById(
                id
            );

        if (
            !service ||
            service.isDeleted
        ) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }

        return service;
    }

    async createService(
        data: CreateServiceInput,
        userId: string
    ) {


        return ServiceRepository.create({
            ...data,

            author:
                new Types.ObjectId(userId),

            featuredImage:
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null,

            gallery:
                data.gallery?.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                ) ?? [],

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            featured:
                data.featured ??
                false,

            sortOrder:
                data.sortOrder ?? 0,

            createdBy:
                new Types.ObjectId(userId),

            updatedBy:
                new Types.ObjectId(userId),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateService(
        id: string,
        data: UpdateServiceInput,
        userId: string
    ) {
        const service =
            await Service.findById(id);

        if (
            !service ||
            service.isDeleted
        ) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }



        Object.assign(
            service,
            data
        );

        if (
            data.featuredImage !==
            undefined
        ) {
            service.featuredImage =
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null;
        }

        if (data.gallery) {
            service.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        service.updatedBy =
            new Types.ObjectId(userId);

        await service.save();

        return service;
    }

    async deleteService(
        id: string
    ) {
        const service =
            await Service.findById(id);

        if (!service) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }

        if (service.isDeleted) {
            throw new ApiError(
                400,
                "Service already deleted."
            );
        }

        service.isDeleted = true;

        service.deletedAt =
            new Date();

        await service.save();

        return true;
    }

    async restoreService(
        id: string
    ) {
        const service =
            await Service.findById(id);

        if (!service) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }

        service.isDeleted = false;

        service.deletedAt = null;

        await service.save();

        return service;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const service =
            await Service.findById(id);

        if (!service) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }

        service.status = status;

        await service.save();

        return service;
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        const service =
            await Service.findById(id);

        if (!service) {
            throw new ApiError(
                404,
                "Service not found."
            );
        }

        service.featured =
            featured;

        await service.save();

        return service;
    }
}

export default new ServiceService();