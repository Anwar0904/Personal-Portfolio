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

import {
    CONTENT_STATUS,
} from "@/enums";

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

        const body =
            await request.json();

        const { status } = body;

        if (
            !Object.values(
                CONTENT_STATUS
            ).includes(status)
        ) {
            throw new Error(
                "Invalid status."
            );
        }

        const { id } =
            await params;

        const tag =
            await tagService.changeStatus(
                id,
                status
            );

        return ApiResponse.success(
            tag,
            "Tag status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}