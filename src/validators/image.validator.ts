import { z } from "zod";

export const ImageSchema = z.object({
    url: z.string().url(),

    publicId: z.string(),

    alt: z.string().optional(),

    width: z.number().optional(),

    height: z.number().optional(),

    mimeType: z.string().optional(),

    size: z.number().optional(),
});