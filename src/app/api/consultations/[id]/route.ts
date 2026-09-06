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

import {
    UpdateConsultationSchema,
} from "@/validators/consultation.validator";

interface Params {
    params: Promise<{
        id: string;
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

        const { id } = await params;

        const consultation =
            await ConsultationService.getConsultationById(
                id
            );

        return ApiResponse.success(
            consultation,
            "Consultation fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.CONSULTATION_UPDATE
            );

        const { id } = await params;

        const body =
            await request.json();

        const data =
            UpdateConsultationSchema.parse(
                body
            );

        const consultation =
            await ConsultationService.updateConsultation(
                id,
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            consultation,
            "Consultation updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CONSULTATION_DELETE
        );

        const { id } = await params;

        await ConsultationService.deleteConsultation(
            id
        );

        return ApiResponse.success(
            null,
            "Consultation deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}
