import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import serviceService from "@/services/service.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";
import { SERVICE_MESSAGES } from "@/constants/service";

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

        const service =
            await serviceService.restoreService(
                id
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.RESTORED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}