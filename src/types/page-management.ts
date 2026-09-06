import { z } from "zod";

import {
    CreatePageSchema,
    UpdatePageSchema,
    PageQuerySchema,
} from "@/validators/page.validator";

export type CreatePageInput =
    z.infer<
        typeof CreatePageSchema
    >;

export type UpdatePageInput =
    z.infer<
        typeof UpdatePageSchema
    >;

export type PageQuery =
    z.infer<
        typeof PageQuerySchema
    >;