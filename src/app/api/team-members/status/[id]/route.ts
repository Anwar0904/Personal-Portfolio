import { NextRequest } from "next/server";

import TeamMemberService from "@/services/team-member.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import { requirePermission } from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import { StatusSchema } from "@/validators/status.validator";

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
            PERMISSIONS.TEAM_MEMBER_UPDATE
        );

        const { id } = await params;

        const body =
            await request.json();

        const { status } =
            StatusSchema.parse(body);

        const teamMember =
            await TeamMemberService.changeStatus(
                id,
                status
            );

        return ApiResponse.success(
            teamMember,
            "Status updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}