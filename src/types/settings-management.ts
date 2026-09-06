import { z } from "zod";

import {
    CreateSettingsSchema,
    UpdateSettingsSchema,
} from "@/validators/settings.validator";

export type CreateSettingsInput =
    z.infer<
        typeof CreateSettingsSchema
    >;

export type UpdateSettingsInput =
    z.infer<
        typeof UpdateSettingsSchema
    >;