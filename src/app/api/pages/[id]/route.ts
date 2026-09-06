import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import PageService from "@/services/page.service";

import {
    UpdatePageSchema,
} from "@/validators/page.validator";

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
        await requirePermission(
            request,
            PERMISSIONS.PAGE_READ
        );

        const { id } =
            await params;

        const page =
            await PageService.getPageById(id);

        return ApiResponse.success(page);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Context
) {
    try {
        const user =
            await requirePermission(
                request,
                PERMISSIONS.PAGE_UPDATE
            );

        const body =
            await request.json();

        const data =
            UpdatePageSchema.parse(body);

        const { id } =
            await params;

        const page =
            await PageService.updatePage(
                id,
                data,
                user._id.toString()
            );

        return ApiResponse.success(page);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Context
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.PAGE_DELETE
        );

        const { id } =
            await params;

        await PageService.deletePage(id);

        return ApiResponse.success(
            null,
            "Page deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}