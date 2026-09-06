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

import { PERMISSIONS } from "@/constants/permissions";
import mediaService from "@/services/media/media.service";

type Context = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: Context
) {
    try {

        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_UPDATE
        );

        const { id } = await params;

        await mediaService.restoreMedia(id);

        return ApiResponse.success(
            null,
            "Media restored successfully."
        );

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}