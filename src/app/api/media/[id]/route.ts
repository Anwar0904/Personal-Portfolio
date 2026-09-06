import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";

import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { Media } from "@/models/media.model";

import { requirePermission } from "@/middleware/auth.middleware";
import { PERMISSIONS } from "@/constants/permissions";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";

const UPLOAD_DIR = path.resolve(
    process.cwd(),
    "public",
    "uploads",
    "media"
);

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.MEDIA_READ
        );

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid media ID.");
        }

        const media = await Media.findOne({
            _id: id,
            isDeleted: false,
        }).lean();

        if (!media) {
            throw new Error("Media not found.");
        }

        return ApiResponse.success(
            media,
            "Media fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.MEDIA_DELETE
        );

        const { id } = await params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new Error(
                "Invalid media ID."
            );
        }

        const media =
            await Media.findOne({
                _id: id,
                isDeleted: false,
            });

        if (!media) {
            throw new Error(
                "Media not found."
            );
        }

        /*
         * Delete physical file.
         */
        if (media.url) {
            try {
                if (media.url.startsWith("http")) {
                    await del(media.url);
                } else {
                    const relativePath =
                        media.url.startsWith("/")
                            ? media.url.slice(1)
                            : media.url;

                    const filePath =
                        path.resolve(process.cwd(), "public", relativePath);

                    if (
                        filePath !== UPLOAD_DIR &&
                        !filePath.startsWith(`${UPLOAD_DIR}${path.sep}`)
                    ) {
                        throw new Error("Invalid media file path.");
                    }

                    await fs.unlink(filePath);
                }
            } catch {
                /*
                 * The database record should still
                 * be marked deleted even if the
                 * physical file is already missing.
                 */
            }
        }

        media.isDeleted = true;
        media.deletedAt = new Date();

        await media.save();

        return ApiResponse.success(
            null,
            "Media deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.MEDIA_UPDATE
        );

        const { id } = await params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new Error(
                "Invalid media ID."
            );
        }

        const media =
            await Media.findOne({
                _id: id,
                isDeleted: true,
            });

        if (!media) {
            throw new Error(
                "Deleted media not found."
            );
        }

        /*
         * Restore only when the physical file
         * still exists.
         */
        if (media.url) {
            const relativePath =
                media.url.startsWith("/")
                    ? media.url.slice(1)
                    : media.url;

            const filePath =
                path.join(
                    process.cwd(),
                    "public",
                    relativePath
                );

            try {
                await fs.access(
                    filePath
                );
            } catch {
                throw new Error(
                    "Cannot restore media because the physical file no longer exists."
                );
            }
        }

        media.isDeleted = false;
        media.deletedAt = null;

        await media.save();

        return ApiResponse.success(
            media,
            "Media restored successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
