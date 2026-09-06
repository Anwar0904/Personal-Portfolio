import { z } from "zod";

import {
    CreateBlogSchema,
    UpdateBlogSchema,
    BlogQuerySchema,
} from "@/validators/blog.validator";

export type CreateBlogInput = z.infer<
    typeof CreateBlogSchema
>;

export type UpdateBlogInput = z.infer<
    typeof UpdateBlogSchema
>;

export type BlogQuery = z.infer<
    typeof BlogQuerySchema
>;