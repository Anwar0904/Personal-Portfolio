import { z } from "zod";
import {
    CreateMediaSchema,
    UpdateMediaSchema,
    MediaQuerySchema,
} from "@/validators/media.validator";

import { MediaType } from "@/enums";

export interface CreateMediaInput {
    fileName: string;
    publicId: string;
    url: string;
    mimeType: string;

    mediaType: MediaType;

    size: number;

    width?: number;

    height?: number;

    alt?: string;

    caption?: string;

    folder?: string;
}

export type UpdateMediaInput = z.infer<
    typeof UpdateMediaSchema
>;

export type MediaQuery = z.infer<
    typeof MediaQuerySchema
>;