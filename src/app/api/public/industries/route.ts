import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicContentQuerySchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
export async function GET(request: NextRequest) { try { const query = PublicContentQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return ApiResponse.success(await PublicContentService.getIndustries(query)); } catch (error) { return handleApiError(error); } }
