import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import { requirePermission } from "@/middleware/auth.middleware";
import { PERMISSIONS } from "@/constants/permissions";

import { Category } from "@/models/category.model";
import { Tag } from "@/models/tag.model";
import { Media } from "@/models/media.model";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.BLOG_READ
        );

        const search =
            request.nextUrl.searchParams
                .get("search")
                ?.trim() ?? "";

        const regex = search
            ? new RegExp(
                search.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                ),
                "i"
            )
            : undefined;

        const [categories, tags, media] =
            await Promise.all([
                Category.find(
                    regex
                        ? {
                            name: {
                                $regex: regex,
                            },
                            isDeleted: false,
                        }
                        : { isDeleted: false }
                )
                    .select("_id name slug")
                    .sort({ name: 1 })
                    .limit(20)
                    .lean(),

                Tag.find(
                    regex
                        ? {
                            name: {
                                $regex: regex,
                            },
                            isDeleted: false,
                        }
                        : { isDeleted: false }
                )
                    .select(
                        "_id name slug color"
                    )
                    .sort({ name: 1 })
                    .limit(20)
                    .lean(),

                Media.find({
                    isDeleted: false,
                    type: "image",
                })
                    .select(
                        "_id name originalName url alt mimeType"
                    )
                    .sort({ createdAt: -1 })
                    .limit(100)
                    .lean(),
            ]);

        return ApiResponse.success(
            {
                categories,
                tags,
                media: media.map((item) => ({
                    _id: String(item._id),
                    title: item.originalName || item.name,
                    url: item.url,
                    alt: item.alt,
                    mimeType: item.mimeType,
                })),
            },
            "Blog lookup data fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
