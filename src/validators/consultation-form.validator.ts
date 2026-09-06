import { z } from "zod";

export const ConsultationFormSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must contain at least 2 characters.")
        .max(100, "Full name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address."),

    phone: z
        .string()
        .trim()
        .max(30, "Phone number is too long.")
        .optional(),

    company: z
        .string()
        .trim()
        .max(120, "Company name is too long.")
        .optional(),

    projectType: z
        .string()
        .min(1, "Select a project type."),

    budget: z
        .string()
        .min(1, "Select an estimated budget."),

    timeline: z
        .string()
        .min(1, "Select an expected timeline."),

    preferredContact: z.enum([
        "email",
        "phone",
        "video-call",
    ]),

    projectTitle: z
        .string()
        .trim()
        .min(3, "Project title must contain at least 3 characters.")
        .max(150, "Project title cannot exceed 150 characters."),

    message: z
        .string()
        .trim()
        .min(20, "Please provide at least 20 characters.")
        .max(5000, "Project description cannot exceed 5000 characters."),
});

export type ConsultationFormValues =
    z.infer<typeof ConsultationFormSchema>;