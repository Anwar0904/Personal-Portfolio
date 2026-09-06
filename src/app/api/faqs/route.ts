import { NextRequest } from "next/server";

import FAQService from "@/services/faq.service";

import {
    CreateFAQSchema,
    FAQQuerySchema,
} from "@/validators/faq.validator";

import { requirePermission } from "@/lib/auth/require-auth";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(request: NextRequest) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.FAQ_READ
        );

        const query = FAQQuerySchema.parse(
            Object.fromEntries(
                request.nextUrl.searchParams
            )
        );

        const result =
            await FAQService.getFAQs(query);

        return ApiResponse.success(result);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requirePermission(
            request,
            PERMISSIONS.FAQ_CREATE
        );

        const data = CreateFAQSchema.parse(
            await request.json()
        );

        const faq = await FAQService.createFAQ(
            data,
            user._id.toString()
        );

        return ApiResponse.created(
            faq,
            "FAQ created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}
