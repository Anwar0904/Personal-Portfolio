import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { ForgotPasswordSchema } from "@/validators/auth/forgot-password.validator";

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const body =
            await request.json();

        const data =
            ForgotPasswordSchema.parse(
                body
            );

        const result =
            await AuthService.forgotPassword(
                data.email
            );

        return ApiResponse.success(
            result,
            "Password reset token generated."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}