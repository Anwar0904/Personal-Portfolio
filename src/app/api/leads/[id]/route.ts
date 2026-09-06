import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    UpdateLeadSchema,
} from "@/validators/lead.validator";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    handleApiError,
} from "@/lib/api/error-handler";

import {
    requireAuth,
    requirePermission,
} from "@/lib/auth/require-auth";

import {
    PERMISSIONS,
} from "@/constants/permissions";

import leadService from "@/services/lead.service";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.LEAD_READ
        );

        const { id } =
            await params;

        const lead =
            await leadService.getLeadById(
                id
            );

        return ApiResponse.success(
            lead,
            "Lead fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        const user =
            await requireAuth(request);

        await requirePermission(
            request,
            PERMISSIONS.LEAD_UPDATE
        );

        const { id } =
            await params;

        const body =
            await request.json();

        const data =
            UpdateLeadSchema.parse(
                body
            );

        const lead =
            await leadService.updateLead(
                id,
                data,
                user._id.toString()
            );

        return ApiResponse.success(
            lead,
            "Lead updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.LEAD_DELETE
        );

        const { id } =
            await params;

        await leadService.deleteLead(
            id
        );

        return ApiResponse.success(
            null,
            "Lead deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}