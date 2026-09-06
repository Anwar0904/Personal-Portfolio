import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";
import { ImageSchema } from "./image.validator";
import { FeatureSchema } from "./feature.validator";
import { FAQSchema } from "./faq.validator";
import { SeoSchema } from "./seo.validator";


export const CreateServiceSchema =
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

        icon:
            ImageSchema.optional(),

        featuredImage: z
            .string()
            .optional()
            .nullable(),

        gallery: z
            .array(z.string())
            .default([]),

        features: z
            .array(FeatureSchema)
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

export const UpdateServiceSchema =
    CreateServiceSchema.partial();

export const ServiceQuerySchema =
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

        featured: z
            .coerce
            .boolean()
            .optional(),

        author: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });
