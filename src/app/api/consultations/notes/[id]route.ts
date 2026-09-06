import { NextRequest } from "next/server";

import { z } from "zod";

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

const NoteSchema = z.object({
    content: z
        .string()
        .trim()
        .min(
            1,
            "Note cannot be empty."
        )
        .max(
            5000,
            "Note cannot exceed 5000 characters."
        ),
});

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.CONSULTATION_UPDATE
            );

        const { id } = await params;

        const body =
            await request.json();

        const { content } =
            NoteSchema.parse(body);

        const consultation =
            await ConsultationService.addNote(
                id,
                content,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            consultation,
            "Consultation note added successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}