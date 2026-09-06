import { z } from "zod";

import {
    CreateIndustrySchema,
    UpdateIndustrySchema,
    IndustryQuerySchema,
} from "@/validators/industry.validator";

export type CreateIndustryInput =
    z.infer<typeof CreateIndustrySchema>;

export type UpdateIndustryInput =
    z.infer<typeof UpdateIndustrySchema>;

export type IndustryQuery =
    z.infer<typeof IndustryQuerySchema>;