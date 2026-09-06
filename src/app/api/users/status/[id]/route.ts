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
    ChangeUserStatusSchema,
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
   PATCH /api/users/:id/status
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
            ChangeUserStatusSchema.parse(
                body
            );

        const status =
            parsedData.status as UserStatus;

        const currentUserId =
            auth._id.toString();

        const user =
            await UserService.changeStatus(
                id,
                status,
                currentUserId
            );

        return ApiResponse.success(
            user,
            "Status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}