import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import serviceService from "@/services/service.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";
import { SERVICE_MESSAGES } from "@/constants/service";

import { StatusSchema } from "@/validators/common.validator";

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

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_UPDATE
        );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            StatusSchema.parse(
                body
            );

        const service =
            await serviceService.changeStatus(
                id,
                data.status
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.STATUS_UPDATED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}