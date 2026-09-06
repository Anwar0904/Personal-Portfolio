import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

export const CreateTestimonialSchema =
    z.object({
        clientName: z
            .string()
            .min(2)
            .max(100),

        company: z
            .string()
            .max(150)
            .optional()
            .default(""),

        designation: z
            .string()
            .max(150)
            .optional()
            .default(""),

        avatar: z
            .string()
            .optional()
            .nullable(),

        message: z
            .string()
            .min(10)
            .max(2000),

        rating: z
            .number()
            .min(1)
            .max(5),

        service: z
            .string()
            .optional()
            .nullable(),

        portfolio: z
            .string()
            .optional()
            .nullable(),

        industry: z
            .string()
            .optional()
            .nullable(),

        featured: z
            .boolean()
            .optional(),

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        sortOrder: z
            .number()
            .min(0)
            .optional(),
    });

export const UpdateTestimonialSchema =
    CreateTestimonialSchema.partial();

export const TestimonialQuerySchema =
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

        featured: z.coerce
            .boolean()
            .optional(),

        service: z
            .string()
            .optional(),

        portfolio: z
            .string()
            .optional(),

        industry: z
            .string()
            .optional(),

        author: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });