// src/app/api/services/route.ts

import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";
import serviceService from "@/services/service.service";

import {
    CreateServiceSchema,
    ServiceQuerySchema,
} from "@/validators/service.validator";

import { requirePermission } from "@/middleware/auth.middleware";
import { SERVICE_MESSAGES } from "@/constants/service";
import { PERMISSIONS } from "@/constants/permissions";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function normalizeServicePayload(
    body: Record<string, unknown>
) {
    const title =
        typeof body.title === "string"
            ? body.title.trim()
            : "";

    const shortDescription =
        typeof body.shortDescription === "string"
            ? body.shortDescription.trim()
            : "";

    const content =
        typeof body.content === "string"
            ? body.content.trim()
            : "";

    const description =
        typeof body.description === "string"
            ? body.description.trim()
            : content;

    const slug =
        typeof body.slug === "string" &&
            body.slug.trim()
            ? slugify(body.slug)
            : slugify(title);

    const featuredImage =
        typeof body.featuredImage === "string"
            ? body.featuredImage
            : null;

    const banner =
        typeof body.banner === "string"
            ? body.banner
            : featuredImage;

    return {
        ...body,
        title,
        slug,
        shortDescription,
        description,
        content,
        featuredImage,
        banner,
        features: Array.isArray(body.features)
            ? body.features
            : [],
        faqs: Array.isArray(body.faqs)
            ? body.faqs
            : [],
        seo:
            body.seo &&
                typeof body.seo === "object"
                ? body.seo
                : {
                    metaTitle: title,
                    metaDescription:
                        shortDescription,
                    keywords: [],
                    canonicalUrl: "",
                    robots: "index,follow",
                },
    };
}

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_READ
        );

        const query =
            ServiceQuerySchema.parse(
                Object.fromEntries(
                    request.nextUrl.searchParams
                )
            );

        const result =
            await serviceService.getServices(
                query
            );

        return ApiResponse.success(
            result,
            SERVICE_MESSAGES.FETCHED
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.SERVICE_CREATE
            );

        const body =
            await request.json();

        const normalized =
            normalizeServicePayload(body);

        const data =
            CreateServiceSchema.parse(
                normalized
            );

        const service =
            await serviceService.createService(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            service,
            SERVICE_MESSAGES.CREATED,
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}