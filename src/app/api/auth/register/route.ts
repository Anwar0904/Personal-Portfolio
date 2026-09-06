import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { RegisterSchema } from "@/validators/auth/register.validator";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate request
    const data = RegisterSchema.parse(body);

    // Register user
    const user = await AuthService.register(data);
    // Return success response
    return ApiResponse.created(
      user,
      "User registered successfully."
    );
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}