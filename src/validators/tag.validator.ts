import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

export const CreateTagSchema =
    z.object({
        name: z.string().min(2).max(50),

        slug: z.string().optional(),

        description: z
            .string()
            .max(500)
            .optional(),

        color: z
            .string()
            .regex(
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            )
            .optional(),

        status: z
            .nativeEnum(CONTENT_STATUS)
            .optional(),
    });

export const UpdateTagSchema =
    CreateTagSchema.partial();

export const TagQuerySchema =
    z.object({
        page: z.coerce.number().min(1).default(1),

        limit: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10),

        search: z.string().optional(),

        status: z
            .nativeEnum(CONTENT_STATUS)
            .optional(),

        sort: z.string().optional(),
    });