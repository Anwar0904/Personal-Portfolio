import { NextRequest } from "next/server";

import LeadService from "@/services/lead.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.LEAD_UPDATE
        );

        const { id } =
            await params;

        const lead =
            await LeadService.markContacted(
                id
            );

        return ApiResponse.success(
            lead,
            "Lead marked as contacted."
        );
    } catch (error) {
        return handleApiError(error);
    }
}