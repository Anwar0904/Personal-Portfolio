import { NextRequest } from "next/server";

import TestimonialService from "@/services/testimonial.service";

import { UpdateTestimonialSchema } from "@/validators/testimonial.validator";

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

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.TESTIMONIAL_READ
        );

        const { id } =
            await params;

        const testimonial =
            await TestimonialService.getTestimonialById(
                id
            );

        return ApiResponse.success(
            testimonial
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
                PERMISSIONS.TESTIMONIAL_UPDATE
            );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            UpdateTestimonialSchema.parse(
                body
            );

        const testimonial =
            await TestimonialService.updateTestimonial(
                id,
                data,
                user._id.toString()
            );

        return ApiResponse.success(
            testimonial,
            "Testimonial updated successfully."
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
            PERMISSIONS.TESTIMONIAL_DELETE
        );

        const { id } =
            await params;

        await TestimonialService.deleteTestimonial(
            id
        );

        return ApiResponse.success(
            null,
            "Testimonial deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}