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
    ChangeBlogStatusSchema,
} from "@/validators/blog.validator";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import { ContentStatus } from "@/enums";

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

        const body =
            await request.json();

        const {
            status,
        } =
            ChangeBlogStatusSchema.parse(
                body
            );

        const blog =
            await blogService.changeStatus(
                id,
                status as ContentStatus
            );

        return ApiResponse.success(
            blog,
            "Blog status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}