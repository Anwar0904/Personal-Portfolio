import { z } from "zod";

import {
    CONTENT_STATUS,
    MEDIA_TYPE,
} from "@/enums";

export const CreateMediaSchema =
    z.object({
        fileName: z
            .string()
            .min(1)
            .max(255),

        publicId: z
            .string()
            .min(1)
            .max(255),

        url: z
            .string()
            .url(),

        mimeType: z
            .string()
            .min(1),

        mediaType: z.enum(MEDIA_TYPE),

        size: z
            .number()
            .positive(),

        width: z
            .number()
            .optional(),

        height: z
            .number()
            .optional(),

        alt: z
            .string()
            .max(255)
            .optional(),

        caption: z
            .string()
            .max(500)
            .optional(),

        folder: z
            .string()
            .max(255)
            .optional(),
    });

export const UpdateMediaSchema =
    z.object({
        alt: z
            .string()
            .max(255)
            .optional(),

        caption: z
            .string()
            .max(500)
            .optional(),

        folder: z
            .string()
            .max(255)
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),
    });

export const MediaQuerySchema =
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

        mediaType: z
            .enum(
                Object.values(
                    MEDIA_TYPE
                ) as [string, ...string[]]
            )
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),

        folder: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });

export type CreateMediaInput =
    z.infer<
        typeof CreateMediaSchema
    >;

export type UpdateMediaInput =
    z.infer<
        typeof UpdateMediaSchema
    >;

export type MediaQuery =
    z.infer<
        typeof MediaQuerySchema
    >;