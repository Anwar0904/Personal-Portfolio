import { z } from "zod";

export const SocialLinkSchema = z.object({
    facebook: z.string().url().optional(),

    linkedin: z.string().url().optional(),

    twitter: z.string().url().optional(),

    instagram: z.string().url().optional(),

    github: z.string().url().optional(),

    website: z.string().url().optional(),
});