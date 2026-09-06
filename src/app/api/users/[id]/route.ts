import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import UserService from "@/services/user/user.service";

import {
    UpdateUserSchema,
} from "@/validators/user.validator";

import {
    UserStatus,
} from "@/enums";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

/* ----------------------------------------
   GET /api/users/:id
----------------------------------------- */

export async function GET(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_READ
        );

        const { id } =
            await params;

        const user =
            await UserService.getUserById(
                id
            );

        return ApiResponse.success(
            user,
            "User fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

/* ----------------------------------------
   PATCH /api/users/:id
----------------------------------------- */

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        await connectDB();

        const auth =
            await requirePermission(
                request,
                PERMISSIONS.USER_UPDATE
            );

        const { id } =
            await params;

        const body =
            await request.json();

        const parsedData =
            UpdateUserSchema.parse(
                body
            );

        const data = {
            ...parsedData,

            status:
                parsedData.status as
                | UserStatus
                | undefined,
        };

        const currentUserId =
            auth._id.toString();

        const user =
            await UserService.updateUser(
                id,
                data,
                currentUserId
            );

        return ApiResponse.success(
            user,
            "User updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

/* ----------------------------------------
   DELETE /api/users/:id
----------------------------------------- */

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        await connectDB();

        const auth =
            await requirePermission(
                request,
                PERMISSIONS.USER_DELETE
            );

        const { id } =
            await params;

        const currentUserId =
            auth._id.toString();

        await UserService.deleteUser(
            id,
            currentUserId
        );

        return ApiResponse.success(
            null,
            "User deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}