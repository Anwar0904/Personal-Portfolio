import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { ChangePasswordSchema } from "@/validators/auth/change-password.validator";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const data =
            ChangePasswordSchema.parse(body);

        /**
         * Temporary
         * We'll replace this after auth middleware.
         */

        const userId = body.userId;

        await AuthService.changePassword(
            userId,
            data
        );

        return ApiResponse.success(
            null,
            "Password changed successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}