import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import PageService from "@/services/page.service";

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
        await requirePermission(
            request,
            PERMISSIONS.PAGE_UPDATE
        );

        const { id } =
            await params;

        const page =
            await PageService.restorePage(
                id
            );

        return ApiResponse.success(
            page,
            "Page restored successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}