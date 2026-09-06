import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

const SeoSchema = z.object({
    metaTitle: z
        .string()
        .min(1)
        .max(200),

    metaDescription: z
        .string()
        .min(1)
        .max(500),

    keywords: z
        .array(z.string())
        .default([]),

    canonicalUrl: z
        .string()
        .optional(),

    robots: z
        .string()
        .optional(),
});

const BlogFaqSchema = z.object({
    question: z
        .string()
        .min(1),

    answer: z
        .string()
        .min(1),
});

export const CreateBlogSchema =
    z.object({
        title: z
            .string()
            .min(5)
            .max(200),

        slug: z
            .string()
            .min(3)
            .max(220)
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Invalid blog slug."
            ),

        excerpt: z
            .string()
            .min(10)
            .max(500),

        content: z
            .string()
            .min(20),

        featuredImage: z
            .string()
            .optional()
            .nullable(),

        gallery: z
            .array(z.string())
            .default([]),

        category: z
            .string()
            .min(1),

        tags: z
            .array(z.string())
            .default([]),

        seo: SeoSchema,

        faqs: z
            .array(BlogFaqSchema)
            .default([]),

        featured: z
            .boolean()
            .default(false),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [
                    string,
                    ...string[]
                ]
            )
            .default(
                CONTENT_STATUS.DRAFT
            ),

        publishedAt: z
            .string()
            .datetime()
            .optional()
            .nullable(),
    });

export const UpdateBlogSchema =
    CreateBlogSchema.partial();

export const ChangeBlogStatusSchema =
    z.object({
        status: z.enum(
            Object.values(
                CONTENT_STATUS
            ) as [
                string,
                ...string[]
            ]
        ),
    });

export const BlogQuerySchema =
    z.object({
        page: z.coerce
            .number()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10),

        search: z
            .string()
            .optional(),

        category: z
            .string()
            .optional(),

        author: z
            .string()
            .optional(),

        tag: z
            .string()
            .optional(),

        featured: z.coerce
            .boolean()
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [
                    string,
                    ...string[]
                ]
            )
            .optional(),

        sort: z
            .string()
            .optional(),
    });