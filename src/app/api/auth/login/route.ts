import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { LoginSchema } from "@/validators/auth/login.validator";

import { setAuthCookies } from "@/lib/auth/auth-cookies";

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const data =
      LoginSchema.parse(body);

    const result =
      await AuthService.login(
        data
      );

    const accessToken =
      result.tokens?.accessToken;

    const refreshToken =
      result.tokens?.refreshToken;

    if (
      !accessToken ||
      !refreshToken
    ) {
      throw new Error(
        "Authentication tokens were not generated."
      );
    }

    await setAuthCookies(
      accessToken,
      refreshToken
    );

    return ApiResponse.success(
      {
        user: result.user,
      },
      "Login successful."
    );
  } catch (error) {
    return ApiErrorHandler.handle(
      error
    );
  }
}