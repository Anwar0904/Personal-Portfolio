import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicContactSchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
export async function POST(request: NextRequest) {

    try {
        const data = PublicContactSchema.parse(await request.json());
        const lead = await PublicContentService.submitContact(data);
        return ApiResponse.created(lead, "Thank you. Your message has been received.");
    } catch (error) {
        return handleApiError(error);
    }
}
