import { z } from "zod";

export const PublicPaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    featured: z.coerce.boolean().optional(),
});

export const PublicContentQuerySchema =
    PublicPaginationSchema.extend({
        search: z.string().trim().min(1).optional(),
    });

export const PublicBlogQuerySchema =
    PublicContentQuerySchema.extend({
        category: z.string().regex(/^[a-f\d]{24}$/i).optional(),
        tag: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    });

export const PublicSlugSchema = z.object({
    slug: z.string().trim().min(1).max(200),
});

export const PublicContactSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    phone: z.string().trim().max(50).optional(),
    company: z.string().trim().max(150).optional(),
    website: z.string().trim().url().optional(),
    interestedServices: z.array(z.string().regex(/^[a-f\d]{24}$/i)).default([]),
    message: z.string().trim().min(10).max(5000),
});

export const PublicConsultationSchema =
    PublicContactSchema.extend({
        scheduledAt: z.coerce.date().refine(
            (date) => date > new Date(),
            "Scheduled time must be in the future."
        ),
        duration: z.number().int().min(15).max(240).default(30),
        meetingType: z.enum([
            "google-meet",
            "zoom",
            "microsoft-teams",
            "phone",
            "in-person",
        ]),
        agenda: z.string().trim().max(2000).optional(),
    });
