import { z } from "zod";

export const NoteSchema =
    z.object({
        note: z
            .string()
            .min(1),

        createdBy: z
            .string()
            .nullable()
            .optional(),

        createdAt: z
            .coerce
            .date()
            .optional(),
    });