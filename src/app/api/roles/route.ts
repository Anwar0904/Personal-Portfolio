import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import {
    roleController,
} from "@/controllers/role.controller";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.ROLE_READ
        );

        const result =
            await roleController.findAll(
                request
            );

        return ApiResponse.success(
            result,
            "Roles fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.ROLE_CREATE
        );

        const role =
            await roleController.create(
                request
            );

        return ApiResponse.success(
            role,
            "Role created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}