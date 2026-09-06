import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { ResetPasswordSchema } from "@/validators/auth/reset-password.validator";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const data = ResetPasswordSchema.parse(body);

        await AuthService.resetPassword(data);


        return ApiResponse.success(
            null,
            "Password reset successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}