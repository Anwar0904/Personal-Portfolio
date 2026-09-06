import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import IndustryService from "@/services/industry.service";

import { PERMISSIONS } from "@/constants/permissions";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.INDUSTRY_UPDATE
        );

        const { id } =
            await params;

        const industry =
            await IndustryService.restoreIndustry(
                id
            );

        return ApiResponse.success(
            industry
        );
    } catch (error) {
        return handleApiError(error);
    }
}