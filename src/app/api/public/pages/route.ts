import { NextRequest } from "next/server";

import { Page } from "@/models/page.model";

import { CONTENT_STATUS } from "@/enums";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";
import { connectDB } from "@/lib/db";

export async function GET(_request: NextRequest) {
    try {
        await connectDB();

        const pages = await Page.find({
            status: CONTENT_STATUS.PUBLISHED,
            isDeleted: false,
        })
            .select(
                "title slug excerpt featuredImage seo updatedAt"
            )
            .populate("featuredImage")
            .sort({
                sortOrder: 1,
                createdAt: -1,
            });

        return ApiResponse.success(
            pages,
            "Pages fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}