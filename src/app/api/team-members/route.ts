import { NextRequest } from "next/server";

import TeamMemberService from "@/services/team-member.service";
import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import { requirePermission } from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import {
    CreateTeamMemberSchema,
    TeamMemberQuerySchema,
} from "@/validators/team-member.validator";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.TEAM_MEMBER_READ
        );

        const query =
            TeamMemberQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await TeamMemberService.getTeamMembers(
                query
            );

        return ApiResponse.success(result);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const user =
            await requirePermission(
                request,
                PERMISSIONS.TEAM_MEMBER_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateTeamMemberSchema.parse(body);

        const teamMember =
            await TeamMemberService.createTeamMember(
                data,
                user.id
            );

        return ApiResponse.created(
            teamMember,
            "Team member created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}