import { z } from "zod";

import {
    CONTENT_STATUS,
    TEAM_MEMBER_TEMPLATES,
} from "@/enums";

import { SeoSchema } from "./seo.validator";
import { SocialLinkSchema } from "./social-link.validator";
import { SkillSchema } from "./skill.validator";

export const TEAM_MEMBER_EMPLOYMENT_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
} as const;

export type TeamMemberEmploymentStatus =
    typeof TEAM_MEMBER_EMPLOYMENT_STATUS[
    keyof typeof TEAM_MEMBER_EMPLOYMENT_STATUS
    ];

export const CreateTeamMemberSchema =
    z.object({
        name: z
            .string()
            .min(2)
            .max(120),

        designation: z
            .string()
            .min(2)
            .max(120)
            .default("Team Member"),

        slug: z
            .string()
            .optional(),

        shortBio: z
            .string()
            .max(500)
            .default(""),

        biography: z
            .string()
            .default(""),

        avatar: z
            .string()
            .nullable()
            .optional(),

        gallery: z
            .array(z.string())
            .default([]),

        email: z
            .string()
            .email()
            .optional()
            .or(z.literal("")),

        phone: z
            .string()
            .default(""),

        experience: z
            .coerce
            .number()
            .min(0)
            .default(0),

        skills: z
            .array(SkillSchema)
            .default([]),

        socialLinks:
            SocialLinkSchema.default({}),

        seo:
            SeoSchema.default({
                metaTitle: "Team Member",
                metaDescription:
                    "Team Member profile and biography.",
                keywords: [],
            }),

        template: z
            .enum(TEAM_MEMBER_TEMPLATES)
            .optional(),

        /*
         * Publishing status
         */
        status: z
            .enum(CONTENT_STATUS)
            .default(
                CONTENT_STATUS.DRAFT
            ),

        /*
         * Employment status
         */
        employmentStatus: z
            .enum(
                TEAM_MEMBER_EMPLOYMENT_STATUS
            )
            .default(
                TEAM_MEMBER_EMPLOYMENT_STATUS.ACTIVE
            ),

        featured: z
            .boolean()
            .default(false),

        sortOrder: z
            .coerce
            .number()
            .min(0)
            .default(0),
    });

export const UpdateTeamMemberSchema =
    CreateTeamMemberSchema.partial();

export const TeamMemberQuerySchema =
    z.object({
        page: z.coerce
            .number()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10),

        search: z
            .string()
            .optional(),

        featured: z.coerce
            .boolean()
            .optional(),

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        employmentStatus: z
            .enum(
                TEAM_MEMBER_EMPLOYMENT_STATUS
            )
            .optional(),

        author: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });