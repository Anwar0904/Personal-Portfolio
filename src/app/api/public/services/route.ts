// src/app/api/public/services/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import serviceService from "@/services/service.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();

        const result =
            await serviceService.getServices({
                page: 1,
                limit: 100,
            });

        const allServices =
            Array.isArray(result)
                ? result
                : result?.services ?? [];

        const services = allServices
            .filter(
                (service: {
                    isDeleted?: boolean;
                    status?: string;
                    published?: boolean;
                }) =>
                    !service.isDeleted &&
                    (
                        service.published === true ||
                        service.status ===
                        "published" ||
                        service.status ===
                        "active"
                    )
            )
            .sort(
                (
                    a: { sortOrder?: number },
                    b: { sortOrder?: number }
                ) =>
                    (a.sortOrder ?? 0) -
                    (b.sortOrder ?? 0)
            );

        return NextResponse.json(
            {
                success: true,
                data: services,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, max-age=0",
                },
            }
        );
    } catch (error) {
        console.error(
            "Public services API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                data: [],
                message:
                    "Failed to load services.",
            },
            {
                status: 500,
            }
        );
    }
}