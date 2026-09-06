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
    UpdateTagSchema,
} from "@/validators/tag.validator";

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

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.TAG_READ
        );

        const { id } =
            await params;

        const tag =
            await tagService.getTagById(
                id
            );

        return ApiResponse.success(
            tag,
            "Tag fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
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
                PERMISSIONS.TAG_UPDATE
            );

        const body =
            await request.json();

        const data =
            UpdateTagSchema.parse(body);

        const { id } =
            await params;

        const tag =
            await tagService.updateTag(
                id,
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            tag,
            "Tag updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
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
            PERMISSIONS.TAG_DELETE
        );

        const { id } =
            await params;

        await tagService.deleteTag(
            id
        );

        return ApiResponse.success(
            null,
            "Tag deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}