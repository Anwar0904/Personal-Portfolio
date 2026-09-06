import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicPaginationSchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET(request: NextRequest) {
    try {
        const query = PublicPaginationSchema.pick({ page: true, limit: true }).parse(Object.fromEntries(request.nextUrl.searchParams));

        return ApiResponse.success(await PublicContentService.getFAQs(query));
    } catch (error) { return handleApiError(error); }
}
