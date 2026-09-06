import { NextRequest } from "next/server";

import TeamMemberService from "@/services/team-member.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requireAuth,
    requirePermission,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import { UpdateTeamMemberSchema } from "@/validators/team-member.validator";

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
            PERMISSIONS.TEAM_MEMBER_READ
        );

        const { id } = await params;

        const teamMember =
            await TeamMemberService.getTeamMemberById(
                id
            );

        return ApiResponse.success(
            teamMember
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
                PERMISSIONS.TEAM_MEMBER_UPDATE
            );

        const { id } = await params;

        const body =
            await request.json();

        const data =
            UpdateTeamMemberSchema.parse(body);

        const teamMember =
            await TeamMemberService.updateTeamMember(
                id,
                data,
                user.id
            );

        return ApiResponse.success(
            teamMember,
            "Team member updated successfully."
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
            PERMISSIONS.TEAM_MEMBER_DELETE
        );

        const { id } = await params;

        await TeamMemberService.deleteTeamMember(
            id
        );

        return ApiResponse.success(
            null,
            "Team member deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}