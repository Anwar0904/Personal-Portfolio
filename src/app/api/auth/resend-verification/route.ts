import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";
import { ResendVerificationSchema } from "@/middleware/resend-verification.validator";


export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const body =
            await request.json();

        const data =
            ResendVerificationSchema.parse(
                body
            );

        const result =
            await AuthService.resendVerificationEmail(
                data.email
            );

        return ApiResponse.success(
            result,
            "Verification email sent."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}