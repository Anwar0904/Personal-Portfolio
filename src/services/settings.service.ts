import { Types } from "mongoose";

import SettingsRepository from "@/repositories/settings.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CreateSettingsInput,
    UpdateSettingsInput,
} from "@/types/settings-management";

class SettingsService {
    async getSettings() {
        const settings =
            await SettingsRepository.getSettings();

        if (!settings) {
            throw new ApiError(
                404,
                "Settings not found."
            );
        }

        return settings;
    }

    async createSettings(
        data: CreateSettingsInput,
        userId: string
    ) {
        const existing =
            await SettingsRepository.getSettings();

        if (existing) {
            throw new ApiError(
                409,
                "Settings already exist."
            );
        }

        return SettingsRepository.create({
            branding: {
                ...data.branding,

                logo: data.branding.logo
                    ? new Types.ObjectId(
                        data.branding.logo
                    )
                    : null,

                favicon:
                    data.branding.favicon
                        ? new Types.ObjectId(
                            data.branding.favicon
                        )
                        : null,
            },

            contact: data.contact,

            social: data.social,

            seo: data.seo,

            features: data.features,

            analyticsId:
                data.analyticsId ?? "",

            createdBy:
                new Types.ObjectId(
                    userId
                ),

            updatedBy:
                new Types.ObjectId(
                    userId
                ),

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateSettings(
        data: UpdateSettingsInput,
        userId: string
    ) {
        const existing =
            await SettingsRepository.getSettings();

        if (!existing) {
            throw new ApiError(
                404,
                "Settings not found."
            );
        }

        const updateData: Record<
            string,
            unknown
        > = {
            updatedBy:
                new Types.ObjectId(
                    userId
                ),
        };

        if (data.branding) {
            updateData.branding = {
                siteName:
                    data.branding.siteName ??
                    existing.branding.siteName,

                siteDescription:
                    data.branding.siteDescription ??
                    existing.branding.siteDescription,

                logo:
                    data.branding.logo ===
                        undefined
                        ? existing.branding
                            .logo
                        : data.branding.logo
                            ? new Types.ObjectId(
                                data.branding
                                    .logo
                            )
                            : null,

                favicon:
                    data.branding
                        .favicon ===
                        undefined
                        ? existing.branding
                            .favicon
                        : data.branding
                            .favicon
                            ? new Types.ObjectId(
                                data.branding
                                    .favicon
                            )
                            : null,
            };
        }

        if (data.contact) {
            updateData.contact = {
                email:
                    data.contact.email ??
                    existing.contact.email,

                phone:
                    data.contact.phone ??
                    existing.contact.phone,

                address:
                    data.contact.address ??
                    existing.contact.address,
            };
        }

        if (data.social) {
            updateData.social = {
                facebook:
                    data.social.facebook ??
                    existing.social.facebook,

                instagram:
                    data.social.instagram ??
                    existing.social.instagram,

                linkedin:
                    data.social.linkedin ??
                    existing.social.linkedin,

                x:
                    data.social.x ??
                    existing.social.x,

                youtube:
                    data.social.youtube ??
                    existing.social.youtube,

                github:
                    data.social.github ??
                    existing.social.github,
            };
        }

        if (data.seo) {
            updateData.seo = {
                metaTitle:
                    data.seo.metaTitle ??
                    existing.seo.metaTitle,

                metaDescription:
                    data.seo.metaDescription ??
                    existing.seo.metaDescription,

                keywords:
                    data.seo.keywords ??
                    existing.seo.keywords,

                canonicalUrl:
                    data.seo.canonicalUrl ??
                    existing.seo.canonicalUrl,

                ogTitle:
                    data.seo.ogTitle ??
                    existing.seo.ogTitle,

                ogDescription:
                    data.seo.ogDescription ??
                    existing.seo.ogDescription,

                ogImage:
                    data.seo.ogImage ??
                    existing.seo.ogImage,

                robots:
                    data.seo.robots ??
                    existing.seo.robots,

                schemaMarkup:
                    data.seo.schemaMarkup ??
                    existing.seo.schemaMarkup,
            };
        }

        if (data.features) {
            updateData.features = {
                maintenanceMode:
                    data.features.maintenanceMode ??
                    existing.features.maintenanceMode,

                consultationEnabled:
                    data.features.consultationEnabled ??
                    existing.features.consultationEnabled,

                careersEnabled:
                    data.features.careersEnabled ??
                    existing.features.careersEnabled,
            };
        }

        if (
            data.analyticsId !==
            undefined
        ) {
            updateData.analyticsId =
                data.analyticsId;
        }

        return SettingsRepository.update(
            updateData
        );
    }
}

export default new SettingsService();
