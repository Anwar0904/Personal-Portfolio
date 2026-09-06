import { z } from "zod";

import {
    LEAD_SOURCE,
    LEAD_STATUS,
} from "@/enums";
import { BudgetSchema } from "./budget.validator";
import { NoteSchema } from "./note.validator";


export const CreateLeadSchema =
    z.object({
        fullName: z
            .string()
            .min(2)
            .max(100),

        email: z
            .string()
            .email(),

        phone: z
            .string()
            .optional(),

        company: z
            .string()
            .optional(),

        website: z
            .string()
            .optional(),


        projectTitle: z
            .string()
            .optional(),

        projectType: z
            .string()
            .optional(),

        timeline: z
            .string()
            .optional(),

        preferredContact: z
            .enum(["email", "phone", "video-call"])
            .optional(),

        attachments: z
            .array(z.string())
            .default([]),

        interestedServices: z
            .array(z.string())
            .default([]),

        budget:
            BudgetSchema.optional().nullable(),

        message: z
            .string()
            .min(10)
            .max(5000),

        source: z
            .enum(LEAD_SOURCE)
            .optional(),

        status: z
            .enum(LEAD_STATUS)
            .optional(),

        assignedTo: z
            .string()
            .optional()
            .nullable(),

        notes: z
            .array(NoteSchema)
            .default([]),
    });

export const UpdateLeadSchema =
    CreateLeadSchema.partial();

export const LeadQuerySchema =
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

        status: z
            .enum(LEAD_STATUS)
            .optional(),

        source: z
            .enum(LEAD_SOURCE)
            .optional(),

        assignedTo: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });