import { z } from "zod";

import { SeoSchema } from "./seo.validator";

const SocialLinksSchema =
    z.object({
        facebook: z.string().optional(),

        instagram: z.string().optional(),

        linkedin: z.string().optional(),

        x: z.string().optional(),

        youtube: z.string().optional(),

        github: z.string().optional(),
    });


export const BrandingSchema =
    z.object({
        siteName: z
            .string()
            .min(2)
            .max(120),

        siteDescription: z
            .string()
            .min(2)
            .max(300),

        logo: z
            .string()
            .nullable()
            .optional(),

        favicon: z
            .string()
            .nullable()
            .optional(),
    });

export const ContactSchema =
    z.object({
        email: z
            .string()
            .email(),

        phone: z
            .string()
            .min(3)
            .max(30),

        address: z
            .string()
            .min(3)
            .max(300),
    });

export const FeaturesSchema =
    z.object({
        maintenanceMode:
            z.boolean(),

        consultationEnabled:
            z.boolean(),

        careersEnabled:
            z.boolean(),
    });

export const CreateSettingsSchema =
    z.object({
        branding:
            BrandingSchema,

        contact:
            ContactSchema,

        social:
            SocialLinksSchema,

        seo:
            SeoSchema,

        features:
            FeaturesSchema,

        analyticsId: z
            .string()
            .optional()
            .default(""),
    });

export const UpdateSettingsSchema =
    z.object({
        branding:
            BrandingSchema.partial()
                .optional(),

        contact:
            ContactSchema.partial()
                .optional(),

        social:
            SocialLinksSchema.partial()
                .optional(),

        seo:
            SeoSchema.partial()
                .optional(),

        features:
            FeaturesSchema.partial()
                .optional(),

        analyticsId: z
            .string()
            .optional(),
    });
