import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { put } from "@vercel/blob";

import { connectDB } from "@/lib/db";
import { Media } from "@/models/media.model";

import { requirePermission } from "@/middleware/auth.middleware";
import { PERMISSIONS } from "@/constants/permissions";

import { ApiResponse } from "@/lib/api/api-response";
import {
    ApiError,
    ApiErrorHandler,
} from "@/lib/api/api-error";

const UPLOAD_DIR = path.join(
    process.cwd(),
    "public",
    "uploads",
    "media"
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const USE_BLOB_STORAGE =
    process.env.NODE_ENV === "production";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",

    "video/mp4",
    "video/webm",

    "application/pdf",
];

let publicIdIndexMigration: Promise<void> | null = null;

async function ensurePublicIdIndex() {
    if (!publicIdIndexMigration) {
        publicIdIndexMigration = (async () => {
            const collection = Media.collection;
            const indexes = await collection.indexes();
            const publicIdIndex = indexes.find(
                (index) => index.name === "publicId_1"
            );

            if (
                publicIdIndex?.unique &&
                publicIdIndex.sparse
            ) {
                return;
            }

            if (publicIdIndex) {
                await collection.dropIndex("publicId_1");
            }

            await collection.createIndex(
                { publicId: 1 },
                {
                    name: "publicId_1",
                    unique: true,
                    sparse: true,
                }
            );
        })().catch((error) => {
            publicIdIndexMigration = null;
            throw error;
        });
    }

    await publicIdIndexMigration;
}

function getMediaType(mimeType: string) {
    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    return "document";
}

function sanitizeFilename(filename: string) {
    return filename
        .normalize("NFKD")
        .replace(/[^\w.-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getSafeExtension(filename: string) {
    return path
        .extname(filename)
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.MEDIA_READ
        );

        const search =
            request.nextUrl.searchParams.get("search");

        const type =
            request.nextUrl.searchParams.get("type");

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (search?.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    originalName: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
            ];
        }

        if (
            type &&
            ["image", "video", "document"].includes(type)
        ) {
            filter.type = type;
        }

        const media = await Media.find(filter)
            .populate(
                "uploadedBy",
                "name email avatar"
            )
            .sort({
                createdAt: -1,
            })
            .lean();

        return ApiResponse.success(
            media,
            "Media fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.MEDIA_CREATE
            );

        await ensurePublicIdIndex();

        if (
            USE_BLOB_STORAGE &&
            !process.env.BLOB_READ_WRITE_TOKEN
        ) {
            throw new ApiError(
                503,
                "Media storage is not configured. Set BLOB_READ_WRITE_TOKEN in the production environment."
            );
        }

        const formData =
            await request.formData();

        const files = formData
            .getAll("files")
            .filter(
                (value): value is File =>
                    value instanceof File
            );

        /*
         * Also support a single "file" field.
         * This makes the endpoint compatible with
         * both uploaders and the media picker.
         */
        const singleFile =
            formData.get("file");

        if (
            files.length === 0 &&
            singleFile instanceof File
        ) {
            files.push(singleFile);
        }

        if (files.length === 0) {
            throw new ApiError(
                400,
                "No files uploaded."
            );
        }

        if (!USE_BLOB_STORAGE) {
            await fs.mkdir(
                UPLOAD_DIR,
                {
                    recursive: true,
                }
            );
        }

        const uploaded = [];

        for (const file of files) {
            if (!file.name) {
                continue;
            }

            if (file.size <= 0) {
                throw new ApiError(
                    400,
                    `File "${file.name}" is empty.`
                );
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new ApiError(
                    400,
                    `File "${file.name}" exceeds the 10 MB limit.`
                );
            }

            if (
                !ALLOWED_MIME_TYPES.includes(
                    file.type
                )
            ) {
                throw new ApiError(
                    400,
                    `File type "${file.type}" is not supported.`
                );
            }

            const extension =
                getSafeExtension(
                    file.name
                );

            const originalBaseName =
                path.basename(
                    file.name,
                    path.extname(file.name)
                );

            const baseName =
                sanitizeFilename(
                    originalBaseName
                ) || "file";

            const uniqueName =
                `${baseName}-${Date.now()}-${crypto
                    .randomBytes(6)
                    .toString("hex")}${extension}`;

            const filePath = path.join(
                UPLOAD_DIR,
                uniqueName
            );

            let fileWritten = false;
            let publicUrl = "";

            try {
                const arrayBuffer =
                    await file.arrayBuffer();

                const buffer =
                    Buffer.from(arrayBuffer);

                if (USE_BLOB_STORAGE) {
                    const blob = await put(
                        `media/${uniqueName}`,
                        buffer,
                        {
                            access: "public",
                            addRandomSuffix: false,
                            contentType: file.type,
                        }
                    );

                    publicUrl = blob.url;
                } else {
                    await fs.writeFile(
                        filePath,
                        buffer
                    );

                    fileWritten = true;
                    publicUrl =
                        `/uploads/media/${uniqueName}`;
                }

                const media =
                    await Media.create({
                        name: uniqueName,

                        originalName:
                            file.name,

                        // Older deployments have a unique publicId index.
                        // Give local files an ID too, rather than inserting
                        // repeated null values into that index.
                        publicId: uniqueName,

                        url: publicUrl,

                        type:
                            getMediaType(
                                file.type
                            ),

                        mimeType:
                            file.type,

                        size:
                            file.size,

                        folder:
                            "general",

                        uploadedBy:
                            currentUser._id,

                        isDeleted: false,

                        deletedAt: null,
                    });

                uploaded.push(media);
            } catch (error) {
                /*
                 * If DB creation fails after the file
                 * was written, remove the orphan file.
                 */
                if (fileWritten) {
                    try {
                        await fs.unlink(
                            filePath
                        );
                    } catch {
                        // Ignore cleanup failure.
                    }
                }

                throw error;
            }
        }

        return ApiResponse.created(
            uploaded,
            "Media uploaded successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
