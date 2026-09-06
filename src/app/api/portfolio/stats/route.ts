import { NextResponse } from "next/server";

import {
    portfolioService,
} from "@/services/portfolio.service";

export async function GET() {
    try {
        const stats =
            await portfolioService.getStats();

        return NextResponse.json(
            {
                success: true,
                data: stats,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/portfolio/stats error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch portfolio statistics.",
            },
            {
                status: 500,
            }
        );
    }
}