import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicConsultationSchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
export async function POST(request: NextRequest) {

    try {

        const data = PublicConsultationSchema.parse(await request.json());
        const consultation = await PublicContentService.submitConsultation(data);

        return ApiResponse.created(consultation, "Your consultation request has been received.");

    } catch (error) {
        return handleApiError(error);
    }
}
