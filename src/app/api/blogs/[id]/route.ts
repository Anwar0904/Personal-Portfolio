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
    UpdateBlogSchema,
} from "@/validators/blog.validator";

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

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.BLOG_READ
        );

        const { id } =
            await params;

        const blog =
            await blogService.getBlogById(
                id
            );

        return ApiResponse.success(
            blog,
            "Blog fetched successfully."
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
                PERMISSIONS.BLOG_UPDATE
            );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            UpdateBlogSchema.parse(
                body
            );

        const blog =
            await blogService.updateBlog(
                id,
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            blog,
            "Blog updated successfully."
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
            PERMISSIONS.BLOG_DELETE
        );

        const { id } =
            await params;

        await blogService.deleteBlog(
            id
        );

        return ApiResponse.success(
            null,
            "Blog deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}