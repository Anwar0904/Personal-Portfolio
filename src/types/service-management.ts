import { z } from "zod";

import {
    CreateServiceSchema,
    UpdateServiceSchema,
    ServiceQuerySchema,
} from "@/validators/service.validator";

export type CreateServiceInput = z.infer<
    typeof CreateServiceSchema
>;

export type UpdateServiceInput = z.infer<
    typeof UpdateServiceSchema
>;

export type ServiceQuery = z.infer<
    typeof ServiceQuerySchema
>;