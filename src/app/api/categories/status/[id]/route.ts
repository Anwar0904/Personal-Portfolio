import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import categoryService from "@/services/category.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import { ContentStatus } from "@/enums";

type Context = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: Context
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CATEGORY_CREATE
        );

        const { id } =
            await params;

        const body =
            await request.json();

        const category =
            await categoryService.changeStatus(
                id,
                body.status as ContentStatus
            );

        return ApiResponse.success(
            category,
            "Category status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}