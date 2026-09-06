import { CONTENT_STATUS } from "@/enums";
import { z } from "zod";

export const PasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "One uppercase letter is required.")
    .regex(/[a-z]/, "One lowercase letter is required.")
    .regex(/[0-9]/, "One number is required.")
    .regex(
        /[^A-Za-z0-9]/,
        "One special character is required."
    );

export const StatusSchema = z.object({
    status: z.enum(CONTENT_STATUS),
});

export const FeaturedSchema = z.object({
    featured: z.boolean(),
});