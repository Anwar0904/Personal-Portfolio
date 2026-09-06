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

import {
    PERMISSIONS,
} from "@/constants/permissions";

import {
    roleController,
} from "@/controllers/role.controller";

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
            PERMISSIONS.ROLE_READ
        );

        const { id } =
            await params;

        const role =
            await roleController.findById(
                id
            );

        return ApiResponse.success(
            role,
            "Role fetched successfully."
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

        await requirePermission(
            request,
            PERMISSIONS.ROLE_UPDATE
        );

        const { id } =
            await params;

        const role =
            await roleController.update(
                request,
                id
            );

        return ApiResponse.success(
            role,
            "Role updated successfully."
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
            PERMISSIONS.ROLE_DELETE
        );

        const { id } =
            await params;

        await roleController.delete(
            id
        );

        return ApiResponse.success(
            null,
            "Role deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}