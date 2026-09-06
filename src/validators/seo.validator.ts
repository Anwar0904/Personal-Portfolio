import { z } from "zod";

import { ImageSchema } from "./image.validator";

export const SeoSchema = z.object({
    metaTitle: z.string().min(1).max(70),

    metaDescription: z.string().min(1).max(170),

    keywords: z.array(z.string()).default([]),

    canonicalUrl: z.preprocess(
        (value) =>
            typeof value === "string" &&
            value.trim() === ""
                ? undefined
                : value,
        z.string().url().optional()
    ),

    ogTitle: z.string().optional(),

    ogDescription: z.string().optional(),

    ogImage: ImageSchema.optional(),

    robots: z.string().optional(),

    schemaMarkup: z.record(
        z.string(),
        z.unknown()
    ).optional(),
});
