import { z } from "zod";

import {
    CreateFAQSchema,
    FAQQuerySchema,
    UpdateFAQSchema,
} from "@/validators/faq.validator";

export type CreateFAQInput =
    z.infer<typeof CreateFAQSchema>;

export type UpdateFAQInput =
    z.infer<typeof UpdateFAQSchema>;

export type FAQQuery =
    z.infer<typeof FAQQuerySchema>;
