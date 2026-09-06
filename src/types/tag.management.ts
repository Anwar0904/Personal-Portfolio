import { CreateTagSchema, TagQuerySchema, UpdateTagSchema } from "@/validators/tag.validator";
import { z } from "zod";



export type CreateTagInput =
    z.infer<typeof CreateTagSchema>;

export type UpdateTagInput =
    z.infer<typeof UpdateTagSchema>;

export type TagQuery =
    z.infer<typeof TagQuerySchema>;