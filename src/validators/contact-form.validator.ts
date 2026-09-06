import { z } from "zod";

export const ContactFormSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name is required")
        .max(100),

    email: z
        .string()
        .email("Enter a valid email"),

    phone: z.string().optional(),

    company: z.string().optional(),

    website: z
        .string()
        .url("Invalid website URL")
        .or(z.literal(""))
        .optional(),

    interestedServices: z
        .array(z.string())
        .min(1, "Select at least one service"),

    budget: z.string().optional(),

    message: z
        .string()
        .min(10, "Message must contain at least 10 characters")
        .max(5000),
});

export type ContactFormSchemaType =
    z.infer<typeof ContactFormSchema>;