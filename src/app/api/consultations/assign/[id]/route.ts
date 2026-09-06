import { NextRequest } from "next/server";

import { z } from "zod";

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

const AssignSchema = z.object({
    assignedTo: z
        .string()
        .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid user ID."
        )
        .nullable(),
});

interface Params {
    params: Promise<{
        id: string;
    }>;
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

        const { assignedTo } =
            AssignSchema.parse(body);

        const consultation =
            await ConsultationService.assignConsultation(
                id,
                assignedTo,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            consultation,
            "Consultation assignment updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}