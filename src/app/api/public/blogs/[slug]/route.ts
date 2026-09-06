import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import PublicContentService from "@/services/public-content.service";

import { PublicSlugSchema } from "@/validators/public.validator";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        const { slug } =
            PublicSlugSchema.parse(
                await params
            );

        const blog =
            await PublicContentService.getBlogBySlug(
                slug
            );

        return ApiResponse.success(
            blog
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}