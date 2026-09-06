import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import PublicContentService from "@/services/public-content.service";

import { PublicBlogQuerySchema } from "@/validators/public.validator";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";


export async function GET(request: NextRequest) {

    try {
        await connectDB();

        const query = PublicBlogQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

        return ApiResponse.success(await PublicContentService.getBlogs(query));

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
