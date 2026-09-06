import { NextRequest } from "next/server";

import FAQService from "@/services/faq.service";
import { UpdateFAQSchema } from "@/validators/faq.validator";
import { requirePermission } from "@/lib/auth/require-auth";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import { PERMISSIONS } from "@/constants/permissions";

type Params = {
    params: Promise<{ id: string }>;
};

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.FAQ_READ
        );

        const { id } = await params;
        const faq = await FAQService.getFAQById(id);

        return ApiResponse.success(faq);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        const user = await requirePermission(
            request,
            PERMISSIONS.FAQ_UPDATE
        );

        const { id } = await params;
        const data = UpdateFAQSchema.parse(
            await request.json()
        );
        const faq = await FAQService.updateFAQ(
            id,
            data,
            user._id.toString()
        );

        return ApiResponse.success(
            faq,
            "FAQ updated successfully."
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
            PERMISSIONS.FAQ_DELETE
        );

        const { id } = await params;
        await FAQService.deleteFAQ(id);

        return ApiResponse.success(
            null,
            "FAQ deleted successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}
