import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

// Used for embedded FAQs on services, industries, and blogs.
export const FAQSchema =
    z.object({
        question: z
            .string()
            .min(5)
            .max(500),

        answer: z
            .string()
            .min(5),
    });

export const CreateFAQSchema =
    FAQSchema.extend({
        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        sortOrder: z
            .number()
            .int()
            .min(0)
            .optional(),
    });

export const UpdateFAQSchema =
    CreateFAQSchema.partial();

export const FAQQuerySchema =
    z.object({
        page: z.coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(10),

        search: z
            .string()
            .trim()
            .min(1)
            .optional(),

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        sort: z
            .enum([
                "sortOrder",
                "-sortOrder",
                "createdAt",
                "-createdAt",
                "updatedAt",
                "-updatedAt",
                "question",
                "-question",
            ])
            .optional(),
    });
