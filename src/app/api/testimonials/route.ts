import { NextRequest } from "next/server";

import TestimonialService from "@/services/testimonial.service";

import {
    CreateTestimonialSchema,
    TestimonialQuerySchema,
} from "@/validators/testimonial.validator";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { ApiResponse } from "@/lib/api/api-response";

import { handleApiError } from "@/lib/api/error-handler";

import { PERMISSIONS } from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.TESTIMONIAL_READ
        );

        const query =
            TestimonialQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await TestimonialService.getTestimonials(
                query
            );

        return ApiResponse.success(
            result
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
                PERMISSIONS.TESTIMONIAL_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateTestimonialSchema.parse(
                body
            );

        const testimonial =
            await TestimonialService.createTestimonial(
                data,
                user._id.toString()
            );

        return ApiResponse.created(
            testimonial,
            "Testimonial created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}