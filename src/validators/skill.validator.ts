import { z } from "zod";

export const SkillSchema =
    z.object({
        name: z
            .string()
            .min(2)
            .max(100),

        level: z
            .number()
            .min(0)
            .max(100)
            .default(100),
    });