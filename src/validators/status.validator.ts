import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

export const StatusSchema =
    z.object({
        status: z.enum(CONTENT_STATUS),
    });