import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import ConsultationService from "@/services/consultation.service";

interface Params {
    params: Promise<{
        leadId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CONSULTATION_READ
        );

        const { leadId } =
            await params;

        const consultations =
            await ConsultationService.getConsultationsByLead(
                leadId
            );

        return ApiResponse.success(
            consultations,
            "Lead consultations fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}