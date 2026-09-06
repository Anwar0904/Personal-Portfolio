import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import categoryService from "@/services/category.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

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

        const category =
            await categoryService.restoreCategory(
                id
            );

        return ApiResponse.success(
            category,
            "Category restored successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}