import { z } from "zod";

import {
    CreateLeadSchema,
    UpdateLeadSchema,
    LeadQuerySchema,
} from "@/validators/lead.validator";

export type CreateLeadInput =
    z.infer<typeof CreateLeadSchema>;

export type UpdateLeadInput =
    z.infer<typeof UpdateLeadSchema>;

export type LeadQuery =
    z.infer<typeof LeadQuerySchema>;