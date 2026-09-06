import { z } from "zod";

import { CONTENT_STATUS } from "@/enums";

import { SeoSchema } from "./seo.validator";

import { PAGE_TEMPLATES } from "@/constants/page";

export const CreatePageSchema =
    z.object({
        title: z
            .string()
            .min(2)
            .max(200),

        excerpt: z
            .string()
            .max(500)
            .optional(),

        content: z
            .string()
            .optional(),

        featuredImage: z
            .string()
            .optional()
            .nullable(),

        seo: SeoSchema,

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        isHomePage: z
            .boolean()
            .optional(),

        template: z
            .enum(PAGE_TEMPLATES)
            .optional(),
    });

export const UpdatePageSchema =
    CreatePageSchema.partial();

export const PageQuerySchema =
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

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        isHomePage: z.coerce
            .boolean()
            .optional(),

        author: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });