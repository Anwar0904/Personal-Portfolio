import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import categoryService from "@/services/category.service";

import { UpdateCategorySchema } from "@/validators/category.validator";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

type Context = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: Context
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CATEGORY_READ
        );

        const { id } =
            await params;

        const category =
            await categoryService.getCategoryById(
                id
            );

        return ApiResponse.success(
            category,
            "Category fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Context
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.CATEGORY_CREATE
            );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            UpdateCategorySchema.parse(
                body
            );

        const category =
            await categoryService.updateCategory(
                id,
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            category,
            "Category updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Context
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CATEGORY_DELETE
        );

        const { id } =
            await params;

        await categoryService.deleteCategory(
            id
        );

        return ApiResponse.success(
            null,
            "Category deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}