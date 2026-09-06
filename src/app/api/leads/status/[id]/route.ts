import { NextRequest } from "next/server";



import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import { LEAD_STATUS } from "@/enums";

import { z } from "zod";
import leadService from "@/services/lead.service";

const StatusSchema = z.object({
    status: z.enum(LEAD_STATUS),
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

        const { status } =
            StatusSchema.parse(
                body
            );

        const lead =
            await leadService.changeStatus(
                id,
                status
            );

        return ApiResponse.success(
            lead,
            "Lead status updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}