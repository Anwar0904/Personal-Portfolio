import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import IndustryService from "@/services/industry.service";

import { PERMISSIONS } from "@/constants/permissions";

import { z } from "zod";

const FeaturedSchema =
    z.object({
        featured: z.boolean(),
    });

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

        const body =
            await request.json();

        const data =
            FeaturedSchema.parse(body);

        const { id } =
            await params;

        const industry =
            await IndustryService.toggleFeatured(
                id,
                data.featured
            );

        return ApiResponse.success(
            industry
        );
    } catch (error) {
        return handleApiError(error);
    }
}