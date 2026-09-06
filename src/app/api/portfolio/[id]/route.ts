import { NextRequest, NextResponse } from "next/server";

import {
    portfolioService,
} from "@/services/portfolio.service";
import { connectDB } from "@/lib/db";
import { requirePermission } from "@/lib/auth/require-auth";
import { PERMISSIONS } from "@/constants/permissions";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await connectDB();

        const { id } =
            await context.params;

        const portfolio =
            await portfolioService.getById(
                id
            );

        return NextResponse.json(
            {
                success: true,
                data: portfolio,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to fetch portfolio project.";

        const status =
            message.includes(
                "not found"
            )
                ? 404
                : 400;

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status,
            }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await connectDB();

        const currentUser = await requirePermission(
            request,
            PERMISSIONS.PORTFOLIO_UPDATE
        );

        const { id } =
            await context.params;

        const body =
            await request.json();

        const portfolio =
            await portfolioService.update(
                id,
                body,
                currentUser._id.toString()
            );

        if (!portfolio) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Portfolio project not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project updated successfully.",
                data: portfolio,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "PATCH /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to update portfolio project.";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: 400,
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await connectDB();

        const currentUser = await requirePermission(
            request,
            PERMISSIONS.PORTFOLIO_DELETE
        );

        const { id } =
            await context.params;

        await portfolioService.delete(
            id,
            currentUser._id.toString()
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project deleted successfully.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "DELETE /api/portfolio/[id] error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete portfolio project.";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: 400,
            }
        );
    }
}