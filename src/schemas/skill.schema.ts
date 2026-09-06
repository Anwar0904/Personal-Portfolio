import { z } from "zod";

export const SkillSchema =
    z.string().min(2).max(100);