import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import PageService from "@/services/page.service";

export async function GET() {
    try {
        const page =
            await PageService.getHomePage();

        return ApiResponse.success(page);
    } catch (error) {
        return handleApiError(error);
    }
}