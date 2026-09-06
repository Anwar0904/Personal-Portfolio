import { NextRequest } from "next/server";

import { z } from "zod";

import TestimonialService from "@/services/testimonial.service";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { ApiResponse } from "@/lib/api/api-response";

import { handleApiError } from "@/lib/api/error-handler";

import { PERMISSIONS } from "@/constants/permissions";

const FeaturedSchema =
    z.object({
        featured:
            z.boolean(),
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
            PERMISSIONS.TESTIMONIAL_UPDATE
        );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            FeaturedSchema.parse(
                body
            );

        const testimonial =
            await TestimonialService.toggleFeatured(
                id,
                data.featured
            );

        return ApiResponse.success(
            testimonial,
            "Featured status updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}