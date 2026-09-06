import { NextRequest } from "next/server";

import TestimonialService from "@/services/testimonial.service";

import { StatusSchema } from "@/validators/status.validator";

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

        const body =
            await request.json();

        const data =
            StatusSchema.parse(body);

        const testimonial =
            await TestimonialService.changeStatus(
                id,
                data.status
            );

        return ApiResponse.success(
            testimonial,
            "Status updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}