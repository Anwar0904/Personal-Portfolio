import { z } from "zod";

import { ImageSchema } from "./image.validator";

export const FeatureSchema = z.object({
    title: z.string().min(1),

    description: z.string().min(1),

    icon: ImageSchema.nullable().optional(),
});