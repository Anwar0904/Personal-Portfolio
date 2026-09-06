import { NextResponse } from "next/server";

import {
    clearAuthCookies,
    getRefreshToken,
} from "@/lib/auth/auth-cookies";
import { connectDB } from "@/lib/db";
import AuthService from "@/services/auth/auth.service";

export async function POST() {
    try {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
            await connectDB();
            await AuthService.logout(refreshToken);
        }
    } catch (error) {
        console.error("POST /api/auth/logout error:", error);
    }

    await clearAuthCookies();

    return NextResponse.json({
        success: true,
        message: "Logged out successfully.",
    });
}