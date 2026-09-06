import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import categoryService from "@/services/category.service";

import {
    CategoryQuerySchema,
    CreateCategorySchema,
} from "@/validators/category.validator";

import {
    requireAuth,
    requirePermission,
} from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CATEGORY_READ
        );

        const query =
            CategoryQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await categoryService.getCategories(
                query
            );

        return ApiResponse.success(
            result,
            "Categories fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.CATEGORY_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateCategorySchema.parse(
                body
            );

        const category =
            await categoryService.createCategory(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            category,
            "Category created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}