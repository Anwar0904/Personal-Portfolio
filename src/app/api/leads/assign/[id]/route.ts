import { NextRequest } from "next/server";

import { z } from "zod";

import LeadService from "@/services/lead.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

const AssignSchema = z.object({
    assignedTo: z.string(),
});

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

        const body =
            await request.json();

        const { assignedTo } =
            AssignSchema.parse(
                body
            );

        const lead =
            await LeadService.assignLead(
                id,
                assignedTo
            );

        return ApiResponse.success(
            lead,
            "Lead assigned successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}