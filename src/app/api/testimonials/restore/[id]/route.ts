import { NextRequest } from "next/server";

import TestimonialService from "@/services/testimonial.service";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { ApiResponse } from "@/lib/api/api-response";

import { handleApiError } from "@/lib/api/error-handler";

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
            PERMISSIONS.TESTIMONIAL_UPDATE
        );

        const { id } =
            await params;

        const testimonial =
            await TestimonialService.restoreTestimonial(
                id
            );

        return ApiResponse.success(
            testimonial,
            "Testimonial restored successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}