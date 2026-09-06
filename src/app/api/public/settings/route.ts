import PublicContentService from "@/services/public-content.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
    try {
        const settings =
            await PublicContentService.getSettings();

        return ApiResponse.success(
            settings,
            "Settings fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}
