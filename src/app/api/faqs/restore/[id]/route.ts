import { NextRequest } from "next/server";

import FAQService from "@/services/faq.service";
import { requirePermission } from "@/lib/auth/require-auth";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import { PERMISSIONS } from "@/constants/permissions";

type Params = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.FAQ_UPDATE
        );

        const { id } = await params;
        const faq = await FAQService.restoreFAQ(id);

        return ApiResponse.success(
            faq,
            "FAQ restored successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}
