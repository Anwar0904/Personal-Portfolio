import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicSlugSchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
type Params = { params: Promise<{ slug: string }> };
export async function GET(_request: NextRequest, { params }: Params) { try { const { slug } = PublicSlugSchema.parse(await params); return ApiResponse.success(await PublicContentService.getServiceBySlug(slug)); } catch (error) { return handleApiError(error); } }
