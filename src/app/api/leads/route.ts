import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    CreateLeadSchema,
    LeadQuerySchema,
} from "@/validators/lead.validator";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import { requireAuth, requirePermission } from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";
import leadService from "@/services/lead.service";

export async function GET(request: NextRequest) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.LEAD_READ
        );

        await connectDB();

        const query =
            LeadQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams.entries()
                )
            );

        const result =
            await leadService.getLeads(query);

        return ApiResponse.success(
            result,
            "Leads fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const user =
            await requireAuth(request);

        await requirePermission(
            request,
            PERMISSIONS.LEAD_CREATE
        );

        const contentType =
            request.headers.get(
                "content-type"
            ) ?? "";

        let data;

        if (
            contentType.includes(
                "multipart/form-data"
            )
        ) {
            const formData =
                await request.formData();

            const parsedBody: Record<
                string,
                unknown
            > = {
                attachments: [],
            };

            formData.forEach(
                (value, key) => {
                    if (
                        key === "attachments"
                    ) {
                        const current =
                            Array.isArray(
                                parsedBody.attachments
                            )
                                ? parsedBody.attachments
                                : [];

                        parsedBody.attachments =
                            [
                                ...current,
                                value instanceof File
                                    ? value.name
                                    : String(value),
                            ];

                        return;
                    }

                    parsedBody[key] =
                        value instanceof File
                            ? value.name
                            : String(value);
                }
            );

            if (
                typeof parsedBody.interestedServices ===
                "string"
            ) {
                try {
                    parsedBody.interestedServices =
                        JSON.parse(
                            parsedBody.interestedServices
                        );
                } catch {
                    parsedBody.interestedServices =
                        String(
                            parsedBody.interestedServices
                        )
                            .split(",")
                            .map((item) =>
                                item.trim()
                            )
                            .filter(Boolean);
                }
            }

            if (
                typeof parsedBody.budget ===
                "string"
            ) {
                try {
                    parsedBody.budget =
                        JSON.parse(
                            parsedBody.budget
                        );
                } catch {
                    parsedBody.budget = null;
                }
            }

            if (
                typeof parsedBody.notes ===
                "string"
            ) {
                try {
                    parsedBody.notes =
                        JSON.parse(
                            parsedBody.notes
                        );
                } catch {
                    parsedBody.notes = [];
                }
            }

            data =
                CreateLeadSchema.parse(
                    parsedBody
                );
        } else {
            const body =
                await request.json();

            data =
                CreateLeadSchema.parse(
                    body
                );
        }

        const lead =
            await leadService.createLead(
                data,
                user._id.toString()
            );

        return ApiResponse.created(
            lead,
            "Lead created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}