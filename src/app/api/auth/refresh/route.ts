import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { RefreshTokenSchema } from "@/validators/auth/refresh.validator";
import { setAuthCookies } from "@/lib/auth/auth-cookies";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const data =
            RefreshTokenSchema.parse(body);

        const result =
            await AuthService.refresh(
                data.refreshToken
            );

        await setAuthCookies(
            result.accessToken,
            result.refreshToken
        );

        return ApiResponse.success(
            result,
            "Token refreshed successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}