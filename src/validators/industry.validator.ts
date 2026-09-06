import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";
import { ImageSchema } from "./image.validator";
import { FAQSchema } from "./faq.validator";
import { SeoSchema } from "./seo.validator";



export const CreateIndustrySchema =
    z.object({
        title: z
            .string()
            .min(3)
            .max(150),

        shortDescription: z
            .string()
            .min(10)
            .max(300),

        content: z
            .string()
            .min(20),

        icon: ImageSchema
            .nullable()
            .optional(),

        featuredImage: z
            .string()
            .nullable()
            .optional(),

        gallery: z
            .array(z.string())
            .default([]),

        services: z
            .array(z.string())
            .default([]),

        faqs: z
            .array(FAQSchema)
            .default([]),

        seo: SeoSchema,

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        featured: z
            .boolean()
            .optional(),

        sortOrder: z
            .number()
            .min(0)
            .optional(),
    });

export const UpdateIndustrySchema =
    CreateIndustrySchema.partial();

export const IndustryQuerySchema =
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

        author: z
            .string()
            .optional(),

        service: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });