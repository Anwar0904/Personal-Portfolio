import { z } from "zod";

import {
    CONSULTATION_STATUS,
    MEETING_TYPE,
} from "@/enums";

const consultationStatuses = [
    CONSULTATION_STATUS.SCHEDULED,
    CONSULTATION_STATUS.COMPLETED,
    CONSULTATION_STATUS.CANCELLED,
    CONSULTATION_STATUS.NO_SHOW,
    CONSULTATION_STATUS.RESCHEDULED,
] as const;

const meetingTypes = [
    MEETING_TYPE.GOOGLE_MEET,
    MEETING_TYPE.ZOOM,
    MEETING_TYPE.MICROSOFT_TEAMS,
    MEETING_TYPE.PHONE,
    MEETING_TYPE.IN_PERSON,
] as const;

const objectId = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ID."
    );

export const CreateConsultationSchema =
    z
        .object({
            lead: objectId,

            assignedTo: objectId
                .nullable()
                .optional(),

            scheduledAt: z
                .string()
                .datetime(),

            duration: z
                .coerce
                .number()
                .min(
                    15,
                    "Consultation must be at least 15 minutes."
                )
                .max(
                    480,
                    "Consultation cannot exceed 8 hours."
                )
                .default(30),

            meetingType: z.enum(meetingTypes),

            meetingLink: z
                .string()
                .trim()
                .url("Invalid meeting link.")
                .optional()
                .or(z.literal("")),

            location: z
                .string()
                .trim()
                .max(500)
                .optional(),

            agenda: z
                .string()
                .trim()
                .max(5000)
                .optional(),

            notes: z
                .array(
                    z.object({
                        note: z
                            .string()
                            .trim()
                            .min(1),

                        createdBy: objectId
                            .optional(),

                        createdAt: z
                            .coerce
                            .date()
                            .optional(),
                    })
                )
                .optional()
                .default([]),

            status: z
                .enum(consultationStatuses)
                .optional(),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.meetingType ===
                    MEETING_TYPE.ZOOM &&
                    !data.meetingLink
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["meetingLink"],
                        message:
                            "Meeting link is required for online consultations.",
                    });
                }

                if (
                    data.meetingType ===
                    MEETING_TYPE.IN_PERSON &&
                    !data.location
                ) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["location"],
                        message:
                            "Location is required for in-person consultations.",
                    });
                }
            }
        );

export const UpdateConsultationSchema =
    z
        .object({
            lead: objectId.optional(),

            assignedTo: objectId
                .nullable()
                .optional(),

            scheduledAt: z
                .string()
                .datetime()
                .optional(),

            duration: z
                .coerce
                .number()
                .min(15)
                .max(480)
                .optional(),

            meetingType: z
                .enum(meetingTypes)
                .optional(),

            meetingLink: z
                .string()
                .trim()
                .url("Invalid meeting link.")
                .optional()
                .or(z.literal("")),

            location: z
                .string()
                .trim()
                .max(500)
                .optional(),

            agenda: z
                .string()
                .trim()
                .max(5000)
                .optional(),

            status: z
                .enum(consultationStatuses)
                .optional(),
        })
        .passthrough();

export const ConsultationQuerySchema =
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

        lead: objectId.optional(),

        assignedTo: objectId.optional(),

        status: z
            .enum(consultationStatuses)
            .optional(),

        meetingType: z
            .enum(meetingTypes)
            .optional(),

        search: z
            .string()
            .trim()
            .optional(),

        from: z
            .string()
            .datetime()
            .optional(),

        to: z
            .string()
            .datetime()
            .optional(),

        sort: z
            .string()
            .default("-scheduledAt"),
    });

export type CreateConsultationInput =
    z.infer<
        typeof CreateConsultationSchema
    >;

export type UpdateConsultationInput =
    z.infer<
        typeof UpdateConsultationSchema
    >;

export type ConsultationQuery =
    z.infer<
        typeof ConsultationQuerySchema
    >;