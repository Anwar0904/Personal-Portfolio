import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import IndustryService from "@/services/industry.service";

import {
    UpdateIndustrySchema,
} from "@/validators/industry.validator";

import { PERMISSIONS } from "@/constants/permissions";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.INDUSTRY_READ
        );

        const { id } =
            await params;

        const industry =
            await IndustryService.getIndustryById(
                id
            );

        return ApiResponse.success(
            industry
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        const user =
            await requirePermission(
                request,
                PERMISSIONS.INDUSTRY_UPDATE
            );

        const body =
            await request.json();

        const data =
            UpdateIndustrySchema.parse(
                body
            );

        const { id } =
            await params;

        const industry =
            await IndustryService.updateIndustry(
                id,
                data,
                user.id
            );

        return ApiResponse.success(
            industry
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.INDUSTRY_DELETE
        );

        const { id } =
            await params;

        await IndustryService.deleteIndustry(
            id
        );

        return ApiResponse.success(
            null,
            "Industry deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}