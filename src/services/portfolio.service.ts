import { Types } from "mongoose";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    IPortfolio,
} from "@/types/portfolio.types";

import {
    portfolioRepository,
} from "@/repositories/portfolio.repository";

export interface CreatePortfolioInput {
    title: string;

    clientName: string;

    shortDescription: string;

    content: string;

    featuredImage?: string | null;

    gallery?: string[];

    services?: string[];

    industries?: string[];

    technologies?: string[];

    projectUrl?: string;

    githubUrl?: string;

    completionDate?: string | Date | null;

    seo: IPortfolio["seo"];

    featured?: boolean;

    status?: ContentStatus;

    sortOrder?: number;
}

export interface UpdatePortfolioInput
    extends Partial<CreatePortfolioInput> { }

export class PortfolioService {
    /**
     * Get portfolio projects.
     */
    async getAll(
        options: {
            search?: string;
            status?: ContentStatus;
            featured?: boolean;
            page?: number;
            limit?: number;
            sort?: string;
        } = {}
    ) {
        return portfolioRepository.findAll(
            options
        );
    }

    /**
     * Get a project by ID.
     */
    async getById(id: string) {
        this.validateObjectId(id);

        const portfolio =
            await portfolioRepository.findById(id);

        if (!portfolio) {
            throw new Error(
                "Portfolio project not found."
            );
        }

        return portfolio;
    }

    /**
     * Get a project by slug.
     */
    async getBySlug(slug: string) {
        const cleanSlug = slug
            .trim()
            .toLowerCase();

        if (!cleanSlug) {
            throw new Error(
                "Portfolio slug is required."
            );
        }

        const portfolio =
            await portfolioRepository.findBySlug(
                cleanSlug
            );

        if (!portfolio) {
            throw new Error(
                "Portfolio project not found."
            );
        }

        return portfolio;
    }

    /**
     * Get published projects.
     */
    async getPublished() {
        return portfolioRepository.findPublished();
    }

    /**
     * Get featured projects.
     */
    async getFeatured() {
        return portfolioRepository.findFeatured();
    }

    /**
     * Create a portfolio project.
     */
    async create(
        input: CreatePortfolioInput,
        authorId: string
    ) {
        this.validateObjectId(authorId);

        const title =
            input.title?.trim();

        const clientName =
            input.clientName?.trim();

        const shortDescription =
            input.shortDescription?.trim();

        const content =
            input.content?.trim();

        if (!title) {
            throw new Error(
                "Project title is required."
            );
        }

        if (!clientName) {
            throw new Error(
                "Client name is required."
            );
        }

        if (!shortDescription) {
            throw new Error(
                "Short description is required."
            );
        }

        if (!content) {
            throw new Error(
                "Project content is required."
            );
        }

        if (!input.seo) {
            throw new Error(
                "SEO data is required."
            );
        }

        if (
            input.featuredImage &&
            !Types.ObjectId.isValid(
                input.featuredImage
            )
        ) {
            throw new Error(
                "Invalid featured image ID."
            );
        }

        const portfolioData:
            Partial<IPortfolio> = {
            title,

            clientName,

            shortDescription,

            content,

            featuredImage:
                input.featuredImage
                    ? new Types.ObjectId(
                        input.featuredImage
                    )
                    : null,

            gallery:
                input.gallery?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

            services:
                input.services?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

            industries:
                input.industries?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

            technologies:
                input.technologies ?? [],

            projectUrl:
                input.projectUrl?.trim() ?? "",

            githubUrl:
                input.githubUrl?.trim() ?? "",

            completionDate:
                input.completionDate
                    ? new Date(
                        input.completionDate
                    )
                    : null,

            seo: input.seo,

            featured:
                input.featured ?? false,

            status:
                input.status ??
                CONTENT_STATUS.DRAFT,

            sortOrder:
                input.sortOrder ?? 0,

            author:
                new Types.ObjectId(authorId),

            createdBy:
                new Types.ObjectId(authorId),

            updatedBy: null,

            isDeleted: false,

            deletedAt: null,
        };

        return portfolioRepository.create(
            portfolioData
        );
    }

    /**
     * Update a portfolio project.
     */
    async update(
        id: string,
        input: UpdatePortfolioInput,
        updatedBy: string
    ) {
        this.validateObjectId(id);

        this.validateObjectId(updatedBy);

        const existing =
            await portfolioRepository.findById(
                id
            );

        if (!existing) {
            throw new Error(
                "Portfolio project not found."
            );
        }

        const updateData:
            Partial<IPortfolio> = {
            updatedBy:
                new Types.ObjectId(
                    updatedBy
                ),
        };

        if (
            input.title !== undefined
        ) {
            const title =
                input.title.trim();

            if (!title) {
                throw new Error(
                    "Project title cannot be empty."
                );
            }

            updateData.title = title;
        }

        if (
            input.clientName !==
            undefined
        ) {
            const clientName =
                input.clientName.trim();

            if (!clientName) {
                throw new Error(
                    "Client name cannot be empty."
                );
            }

            updateData.clientName =
                clientName;
        }

        if (
            input.shortDescription !==
            undefined
        ) {
            updateData.shortDescription =
                input.shortDescription.trim();
        }

        if (
            input.content !== undefined
        ) {
            updateData.content =
                input.content.trim();
        }

        if (
            input.featuredImage !==
            undefined
        ) {
            if (
                input.featuredImage &&
                !Types.ObjectId.isValid(
                    input.featuredImage
                )
            ) {
                throw new Error(
                    "Invalid featured image ID."
                );
            }

            updateData.featuredImage =
                input.featuredImage
                    ? new Types.ObjectId(
                        input.featuredImage
                    )
                    : null;
        }

        if (
            input.gallery !==
            undefined
        ) {
            updateData.gallery =
                input.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            input.services !==
            undefined
        ) {
            updateData.services =
                input.services.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            input.industries !==
            undefined
        ) {
            updateData.industries =
                input.industries.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            input.technologies !==
            undefined
        ) {
            updateData.technologies =
                input.technologies;
        }

        if (
            input.projectUrl !==
            undefined
        ) {
            updateData.projectUrl =
                input.projectUrl.trim();
        }

        if (
            input.githubUrl !==
            undefined
        ) {
            updateData.githubUrl =
                input.githubUrl.trim();
        }

        if (
            input.completionDate !==
            undefined
        ) {
            updateData.completionDate =
                input.completionDate
                    ? new Date(
                        input.completionDate
                    )
                    : null;
        }

        if (
            input.seo !== undefined
        ) {
            updateData.seo = input.seo;
        }

        if (
            input.featured !==
            undefined
        ) {
            updateData.featured =
                input.featured;
        }

        if (
            input.status !==
            undefined
        ) {
            updateData.status =
                input.status;
        }

        if (
            input.sortOrder !==
            undefined
        ) {
            updateData.sortOrder =
                input.sortOrder;
        }

        return portfolioRepository.update(
            id,
            updateData
        );
    }

    /**
     * Soft delete a project.
     */
    async delete(
        id: string,
        deletedBy: string
    ) {
        this.validateObjectId(id);

        this.validateObjectId(deletedBy);

        const portfolio =
            await portfolioRepository.softDelete(
                id,
                new Types.ObjectId(
                    deletedBy
                )
            );

        if (!portfolio) {
            throw new Error(
                "Portfolio project not found."
            );
        }

        return portfolio;
    }

    /**
     * Get portfolio statistics.
     */
    async getStats() {
        const [
            total,
            published,
            drafts,
            featured,
        ] = await Promise.all([
            portfolioRepository.count(),

            portfolioRepository.countByStatus(
                CONTENT_STATUS.PUBLISHED
            ),

            portfolioRepository.countByStatus(
                CONTENT_STATUS.DRAFT
            ),

            portfolioRepository.countFeatured(),
        ]);

        return {
            total,
            published,
            drafts,
            featured,
        };
    }

    /**
     * Validate MongoDB ObjectId.
     */
    private validateObjectId(
        value: string
    ) {
        if (
            !Types.ObjectId.isValid(value)
        ) {
            throw new Error(
                `Invalid MongoDB ObjectId: ${value}`
            );
        }
    }
}

export const portfolioService =
    new PortfolioService();