import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import blogService from "@/services/blog.service";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

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
            PERMISSIONS.BLOG_UPDATE
        );

        const { id } =
            await params;

        const blog =
            await blogService.restoreBlog(
                id
            );

        return ApiResponse.success(
            blog,
            "Blog restored successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}