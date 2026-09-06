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
    ChangeUserStatusSchema,
} from "@/validators/user.validator";

import UserService from "@/services/user/user.service";

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

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.USER_UPDATE
            );

        const { id } = await params;

        const body =
            await request.json();

        const data =
            ChangeUserStatusSchema.parse(
                body
            );

        const user =
            await UserService.changeStatus(
                id,
                data.status,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            user,
            "User status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}