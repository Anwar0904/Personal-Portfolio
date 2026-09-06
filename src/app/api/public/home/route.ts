import PublicContentService from "@/services/public-content.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
    try {
        const home =
            await PublicContentService.getHomePage();

        return ApiResponse.success(
            home,
            "Homepage fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}