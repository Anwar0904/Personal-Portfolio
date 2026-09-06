import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import ConsultationService from "@/services/consultation.service";

import {
    CreateConsultationSchema,
    ConsultationQuerySchema,
} from "@/validators/consultation.validator";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.CONSULTATION_READ
        );

        const query =
            ConsultationQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await ConsultationService.getConsultations(
                query
            );

        return ApiResponse.success(
            result,
            "Consultations fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.CONSULTATION_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateConsultationSchema.parse(
                body
            );

        const consultation =
            await ConsultationService.createConsultation(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            consultation,
            "Consultation created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}