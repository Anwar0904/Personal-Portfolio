import {
    SortOrder,
    Types,
} from "mongoose";

import { Testimonial } from "@/models/testimonial.model";

import { ITestimonial } from "@/types/testimonial.types";

class TestimonialRepository {
    async create(
        data: Partial<ITestimonial>
    ) {
        return Testimonial.create(data);
    }

    async findById(id: string) {
        return Testimonial.findById(id)
            .populate("avatar")
            .populate(
                "service",
                "title slug"
            )
            .populate(
                "portfolio",
                "title slug"
            )
            .populate(
                "industry",
                "title slug"
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

    async getTestimonials(
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
        return Testimonial.find(filter)
            .populate(
                "service",
                "title slug"
            )
            .populate(
                "portfolio",
                "title slug"
            )
            .populate(
                "industry",
                "title slug"
            )
            .populate("avatar")
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

    async countTestimonials(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Testimonial.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<ITestimonial>
    ) {
        return Testimonial.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string) {
        return Testimonial.findByIdAndUpdate(
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
        return Testimonial.findByIdAndUpdate(
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
        return Testimonial.findByIdAndUpdate(
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
        return Testimonial.findByIdAndUpdate(
            id,
            {
                featured,
            },
            {
                new: true,
            }
        );
    }

    async findPublished() {
        return Testimonial.findPublished();
    }

    async findFeatured() {
        return Testimonial.findFeatured();
    }

    async incrementSortOrder(
        id: string,
        sortOrder: number
    ) {
        return Testimonial.findByIdAndUpdate(
            id,
            {
                sortOrder,
            },
            {
                new: true,
            }
        );
    }
}

export default new TestimonialRepository();