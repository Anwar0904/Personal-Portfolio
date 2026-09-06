import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import blogService from "@/services/blog.service";

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

        const { id } = await params;

        await blogService.incrementViews(id);

        return ApiResponse.success(
            null,
            "View count updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}