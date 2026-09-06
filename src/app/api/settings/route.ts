import { NextRequest } from "next/server";

import SettingsService from "@/services/settings.service";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

import {
    requirePermission,
    requireAuth,
} from "@/lib/auth/require-auth";

import { PERMISSIONS } from "@/constants/permissions";

import {
    CreateSettingsSchema,
    UpdateSettingsSchema,
} from "@/validators/settings.validator";

export async function GET(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.SETTINGS_MANAGE
        );

        const settings =
            await SettingsService.getSettings();

        return ApiResponse.success(
            settings,
            "Settings fetched successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.SETTINGS_MANAGE
        );

        const user =
            await requireAuth(request);

        const body =
            await request.json();

        const data =
            CreateSettingsSchema.parse(
                body
            );

        const settings =
            await SettingsService.createSettings(
                data,
                user._id.toString()
            );

        return ApiResponse.created(
            settings,
            "Settings created successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    request: NextRequest
) {
    try {
        await requirePermission(
            request,
            PERMISSIONS.SETTINGS_MANAGE
        );

        const user =
            await requireAuth(request);

        const body =
            await request.json();

        const data =
            UpdateSettingsSchema.parse(
                body
            );

        const settings =
            await SettingsService.updateSettings(
                data,
                user._id.toString()
            );

        return ApiResponse.success(
            settings,
            "Settings updated successfully."
        );
    } catch (error) {
        return handleApiError(error);
    }
}