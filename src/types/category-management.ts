import { z } from "zod";

import {
    CreateCategorySchema,
    UpdateCategorySchema,
    CategoryQuerySchema,
} from "@/validators/category.validator";

export type CreateCategoryInput = z.infer<
    typeof CreateCategorySchema
>;

export type UpdateCategoryInput = z.infer<
    typeof UpdateCategorySchema
>;

export type CategoryQuery = z.infer<
    typeof CategoryQuerySchema
>;