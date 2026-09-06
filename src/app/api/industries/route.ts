import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";


import IndustryService from "@/services/industry.service";

import {
    CreateIndustrySchema,
    IndustryQuerySchema,
} from "@/validators/industry.validator";

import { PERMISSIONS } from "@/constants/permissions";
import { handleApiError } from "@/lib/api/error-handler";
import { requirePermission } from "@/lib/auth/require-auth";

export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.INDUSTRY_READ
        );

        const query =
            IndustryQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const industries =
            await IndustryService.getIndustries(
                query
            );

        return ApiResponse.success(
            industries
        );
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
                PERMISSIONS.INDUSTRY_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateIndustrySchema.parse(
                body
            );

        const industry =
            await IndustryService.createIndustry(
                data,
                user.id
            );

        return ApiResponse.created(
            industry
        );
    } catch (error) {
        return handleApiError(error);
    }
}