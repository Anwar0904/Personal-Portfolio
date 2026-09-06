import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import UserService from "@/services/user/user.service";

import {
    CreateUserSchema,
    UserQuerySchema,
} from "@/validators/user.validator";

import {
    UserStatus,
} from "@/enums";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_READ
        );

        const searchParams =
            request.nextUrl.searchParams;

        const rawQuery = {
            page:
                searchParams.get("page") ??
                undefined,

            limit:
                searchParams.get("limit") ??
                undefined,

            search:
                searchParams.get("search") ??
                undefined,

            role:
                searchParams.get("role") ??
                undefined,

            status:
                searchParams.get("status") ??
                undefined,

            verified:
                searchParams.get("verified") ??
                undefined,

            includeDeleted:
                searchParams.get(
                    "includeDeleted"
                ) ?? undefined,

            sort:
                searchParams.get("sort") ??
                undefined,
        };

        const parsedQuery =
            UserQuerySchema.parse(
                rawQuery
            );

        const query = {
            ...parsedQuery,

            status:
                parsedQuery.status as
                | UserStatus
                | undefined,
        };

        const result =
            await UserService.getUsers(
                query
            );

        return ApiResponse.success(
            result,
            "Users fetched successfully."
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

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.USER_CREATE
            );

        const body =
            await request.json();

        const parsedData =
            CreateUserSchema.parse(
                body
            );

        const data = {
            ...parsedData,

            status:
                parsedData.status as
                | UserStatus
                | undefined,
        };

        const currentUserId =
            currentUser._id.toString();

        const user =
            await UserService.createUser(
                data,
                currentUserId
            );

        return ApiResponse.success(
            user,
            "User created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}