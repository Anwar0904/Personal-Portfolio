import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { VerifyEmailSchema } from "@/validators/auth/verify-email.validator";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const data =
            VerifyEmailSchema.parse(body);

        await AuthService.verifyEmail(
            data.token
        );

        return ApiResponse.success(
            null,
            "Email verified successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}