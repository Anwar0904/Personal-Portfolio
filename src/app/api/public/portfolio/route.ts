import { NextRequest } from "next/server";
import PublicContentService from "@/services/public-content.service";
import { PublicContentQuerySchema } from "@/validators/public.validator";
import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import { connectDB } from "@/lib/db";
export async function GET(request: NextRequest) { try { await connectDB(); const query = PublicContentQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return ApiResponse.success(await PublicContentService.getPortfolio(query)); } catch (error) { return handleApiError(error); } }
