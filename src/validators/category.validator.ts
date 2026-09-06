import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

export const CreateCategorySchema =
    z.object({
        name: z
            .string()
            .min(2)
            .max(100),

        slug: z
            .string()
            .optional(),

        description: z
            .string()
            .max(1000)
            .optional(),

        image: z
            .any()
            .optional(),

        parent: z
            .string()
            .optional()
            .nullable(),

        seo: z
            .any()
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),

        sortOrder: z
            .number()
            .min(0)
            .optional(),
    });

export const UpdateCategorySchema =
    CreateCategorySchema.partial();

export const CategoryQuerySchema =
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

        parent: z
            .string()
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),

        sort: z
            .string()
            .optional(),
    });