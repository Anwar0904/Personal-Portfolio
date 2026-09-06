import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import tagService from "@/services/tag.service";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.TAG_UPDATE
        );

        const { id } =
            await params;

        const tag =
            await tagService.restoreTag(
                id
            );

        return ApiResponse.success(
            tag,
            "Tag restored successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}