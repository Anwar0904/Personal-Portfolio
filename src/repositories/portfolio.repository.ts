import { Types } from "mongoose";

import { Portfolio } from "@/models/portfolio.model";
import { CONTENT_STATUS, ContentStatus } from "@/enums";
import { IPortfolio, PortfolioDocument } from "@/types/portfolio.types";

export interface FindPortfolioOptions {
    search?: string;
    status?: ContentStatus;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface PaginatedPortfolioResult {
    data: PortfolioDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class PortfolioRepository {
    /**
     * Get paginated portfolio projects.
     */
    async findAll(
        options: FindPortfolioOptions = {}
    ): Promise<PaginatedPortfolioResult> {
        const {
            search,
            status,
            featured,
            page = 1,
            limit = 10,
            sort = "-createdAt",
        } = options;

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (status) {
            filter.status = status;
        }

        if (typeof featured === "boolean") {
            filter.featured = featured;
        }

        if (search?.trim()) {
            filter.$text = {
                $search: search.trim(),
            };
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Portfolio.find(filter)
                .populate("featuredImage")
                .populate("gallery")
                .populate("services")
                .populate("industries")
                .populate("author", "name email")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),

            Portfolio.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Find a portfolio project by ID.
     */
    async findById(
        id: string | Types.ObjectId
    ): Promise<PortfolioDocument | null> {
        return Portfolio.findOne({
            _id: id,
            isDeleted: false,
        })
            .populate("featuredImage")
            .populate("gallery")
            .populate("services")
            .populate("industries")
            .populate("author", "name email")
            .exec();
    }

    /**
     * Find a portfolio project by slug.
     */
    async findBySlug(
        slug: string
    ): Promise<PortfolioDocument | null> {
        return Portfolio.findOne({
            slug,
            isDeleted: false,
        })
            .populate("featuredImage")
            .populate("gallery")
            .populate("services")
            .populate("industries")
            .populate("author", "name email")
            .exec();
    }

    /**
     * Get all published portfolio projects.
     */
    async findPublished(): Promise<PortfolioDocument[]> {
        return Portfolio.find({
            status: CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        })
            .populate("featuredImage")
            .populate("gallery")
            .populate("services")
            .populate("industries")
            .populate("author", "name email")
            .sort({
                sortOrder: 1,
                createdAt: -1,
            })
            .exec();
    }

    /**
     * Get all featured and published projects.
     */
    async findFeatured(): Promise<PortfolioDocument[]> {
        return Portfolio.find({
            featured: true,
            status: CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        })
            .populate("featuredImage")
            .populate("gallery")
            .populate("services")
            .populate("industries")
            .populate("author", "name email")
            .sort({
                sortOrder: 1,
                createdAt: -1,
            })
            .exec();
    }

    /**
     * Create a portfolio project.
     */
    async create(
        data: Partial<IPortfolio>
    ): Promise<PortfolioDocument> {
        const portfolio = new Portfolio(data);

        return portfolio.save();
    }

    /**
     * Update a portfolio project.
     */
    async update(
        id: string | Types.ObjectId,
        data: Partial<IPortfolio>
    ): Promise<PortfolioDocument | null> {
        return Portfolio.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("featuredImage")
            .populate("gallery")
            .populate("services")
            .populate("industries")
            .populate("author", "name email")
            .exec();
    }

    /**
     * Soft delete a portfolio project.
     */
    async softDelete(
        id: string | Types.ObjectId,
        deletedBy?: Types.ObjectId
    ): Promise<PortfolioDocument | null> {
        return Portfolio.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    updatedBy: deletedBy ?? null,
                },
            },
            {
                new: true,
            }
        ).exec();
    }

    /**
     * Count all non-deleted projects.
     */
    async count(): Promise<number> {
        return Portfolio.countDocuments({
            isDeleted: false,
        });
    }

    /**
     * Count projects by status.
     */
    async countByStatus(
        status: ContentStatus
    ): Promise<number> {
        return Portfolio.countDocuments({
            status,
            isDeleted: false,
        });
    }

    /**
     * Count featured projects.
     */
    async countFeatured(): Promise<number> {
        return Portfolio.countDocuments({
            featured: true,
            isDeleted: false,
        });
    }

    /**
     * Check whether a slug already exists.
     */
    async slugExists(
        slug: string,
        excludeId?: string | Types.ObjectId
    ): Promise<boolean> {
        const filter: Record<string, unknown> = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne: excludeId,
            };
        }

        const count =
            await Portfolio.countDocuments(filter);

        return count > 0;
    }
}

export const portfolioRepository =
    new PortfolioRepository();