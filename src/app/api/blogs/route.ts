import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import blogService from "@/services/blog.service";

import {
    BlogQuerySchema,
    CreateBlogSchema,
} from "@/validators/blog.validator";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.BLOG_READ
        );

        const query =
            BlogQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl
                        .searchParams
                        .entries()
                )
            );

        const result =
            await blogService.getBlogs(
                query
            );

        return ApiResponse.success(
            result,
            "Blogs fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.BLOG_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateBlogSchema.parse(
                body
            );

        const blog =
            await blogService.createBlog(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            blog,
            "Blog created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}