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
    CreateTagSchema,
    TagQuerySchema,
} from "@/validators/tag.validator";

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
            PERMISSIONS.TAG_READ
        );

        const query =
            TagQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await tagService.getTags(
                query
            );

        return ApiResponse.success(
            result,
            "Tags fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
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
                PERMISSIONS.TAG_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateTagSchema.parse(body);

        const tag =
            await tagService.createTag(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            tag,
            "Tag created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}