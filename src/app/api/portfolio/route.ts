import { NextRequest, NextResponse } from "next/server";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    portfolioService,
} from "@/services/portfolio.service";

import {
    isEnumValue,
} from "@/utils/enum.utils";
import { connectDB } from "@/lib/db";
import { requirePermission } from "@/lib/auth/require-auth";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        const { searchParams } =
            new URL(request.url);

        const search =
            searchParams.get("search") ||
            undefined;

        const statusParam =
            searchParams.get("status");

        let status:
            | ContentStatus
            | undefined;

        if (statusParam) {
            if (
                !isEnumValue(
                    CONTENT_STATUS,
                    statusParam
                )
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Invalid portfolio status: ${statusParam}`,
                    },
                    {
                        status: 400,
                    }
                );
            }

            status = statusParam;
        }

        const featuredParam =
            searchParams.get("featured");

        const featured =
            featuredParam === null
                ? undefined
                : featuredParam === "true";

        const pageParam =
            Number(
                searchParams.get("page")
            ) || 1;

        const limitParam =
            Number(
                searchParams.get("limit")
            ) || 10;

        const result =
            await portfolioService.getAll({
                search,
                status,
                featured,
                page: Math.max(
                    1,
                    pageParam
                ),
                limit: Math.min(
                    100,
                    Math.max(
                        1,
                        limitParam
                    )
                ),
            });

        return NextResponse.json(
            {
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages:
                        result.totalPages,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/portfolio error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch portfolio projects.",
            },
            {
                status: 500,
            }
        );
    }
}
export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser = await requirePermission(
            request,
            PERMISSIONS.PORTFOLIO_CREATE
        );

        const body =
            await request.json();

        const portfolio =
            await portfolioService.create(
                body,
                currentUser._id.toString()
            );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Portfolio project created successfully.",
                data: portfolio,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/portfolio error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create portfolio project.";

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