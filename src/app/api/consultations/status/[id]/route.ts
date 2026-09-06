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
    z,
} from "zod";

import {
    CONSULTATION_STATUS,
} from "@/enums";

const StatusSchema = z.object({
    status: z.enum(CONSULTATION_STATUS),
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

        const { status } =
            StatusSchema.parse(body);

        const consultation =
            await ConsultationService.changeStatus(
                id,
                status,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            consultation,
            "Consultation status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}
