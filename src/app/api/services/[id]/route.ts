// src/app/api/services/[id]/route.ts

import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";
import serviceService from "@/services/service.service";

import { UpdateServiceSchema } from "@/validators/service.validator";
import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";
import { SERVICE_MESSAGES } from "@/constants/service";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function normalizeUpdatePayload(
    body: Record<string, unknown>
) {
    const normalized = { ...body };

    if (
        typeof normalized.title === "string" &&
        !normalized.slug
    ) {
        normalized.slug = slugify(
            normalized.title
        );
    }

    if (
        typeof normalized.content === "string" &&
        !normalized.description
    ) {
        normalized.description =
            normalized.content;
    }

    if (
        typeof normalized.featuredImage ===
        "string" &&
        !normalized.banner
    ) {
        normalized.banner =
            normalized.featuredImage;
    }

    return normalized;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_READ
        );

        const { id } = await params;

        const service =
            await serviceService.getServiceById(
                id
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.FETCHED_ONE
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.SERVICE_UPDATE
            );

        const { id } = await params;

        const body =
            await request.json();

        const data =
            UpdateServiceSchema.parse(
                normalizeUpdatePayload(body)
            );

        const service =
            await serviceService.updateService(
                id,
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.UPDATED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_DELETE
        );

        const { id } = await params;

        await serviceService.deleteService(
            id
        );

        return ApiResponse.success(
            null,
            SERVICE_MESSAGES.DELETED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}