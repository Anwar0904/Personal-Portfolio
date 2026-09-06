import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import PageService from "@/services/page.service";

import {
    CreatePageSchema,
    PageQuerySchema,
} from "@/validators/page.validator";

export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.PAGE_READ
        );

        const searchParams =
            request.nextUrl.searchParams;

        const query =
            PageQuerySchema.parse(
                Object.fromEntries(searchParams)
            );

        const result =
            await PageService.getPages(query);

        return ApiResponse.success(result);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        const user =
            await requirePermission(
                request,
                PERMISSIONS.PAGE_CREATE
            );

        const body =
            await request.json();

        const data =
            CreatePageSchema.parse(body);

        const result =
            await PageService.createPage(
                data,
                user._id.toString()
            );

        return ApiResponse.created(result);
    } catch (error) {
        return handleApiError(error);
    }
}