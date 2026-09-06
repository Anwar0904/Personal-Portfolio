"use client";

import MediaPicker from "@/components/admin/media/media-picker";
import { useEffect, useState } from "react";


type SettingsForm = {
    branding: {
        siteName: string;
        siteDescription: string;
        logo: string | null;
        favicon: string | null;
    };

    contact: {
        email: string;
        phone: string;
        address: string;
    };

    social: {
        facebook: string;
        instagram: string;
        linkedin: string;
        x: string;
        youtube: string;
        github: string;
    };

    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        canonicalUrl?: string;
        robots?: string;
    };

    features: {
        maintenanceMode: boolean;
        consultationEnabled: boolean;
        careersEnabled: boolean;
    };

    analyticsId: string;
};

const emptySettings: SettingsForm = {
    branding: {
        siteName: "ADM",
        siteDescription:
            "Digital solutions for modern businesses.",
        logo: null,
        favicon: null,
    },

    contact: {
        email: "",
        phone: "",
        address: "",
    },

    social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        x: "",
        youtube: "",
        github: "",
    },

    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalUrl: "",
        robots: "",
    },

    features: {
        maintenanceMode: false,
        consultationEnabled: true,
        careersEnabled: true,
    },

    analyticsId: "",
};

export default function SettingsPage() {
    const [settings, setSettings] =
        useState<SettingsForm>(
            emptySettings
        );

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadSettings() {
            try {
                const response =
                    await fetch(
                        "/api/settings",
                        {
                            cache: "no-store",
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ??
                        "Unable to load settings."
                    );
                }

                if (result.data) {
                    setSettings(
                        normalizeSettings(
                            result.data
                        )
                    );
                }
            } catch (reason) {
                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Unable to load settings."
                );
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, []);

    function normalizeSettings(
        data: any
    ): SettingsForm {
        return {
            branding: {
                siteName:
                    data.branding?.siteName ??
                    "",
                siteDescription:
                    data.branding
                        ?.siteDescription ??
                    "",
                logo:
                    typeof data.branding
                        ?.logo === "string"
                        ? data.branding.logo
                        : data.branding?.logo
                            ?._id ?? null,
                favicon:
                    typeof data.branding
                        ?.favicon === "string"
                        ? data.branding.favicon
                        : data.branding?.favicon
                            ?._id ?? null,
            },

            contact: {
                email:
                    data.contact?.email ??
                    "",
                phone:
                    data.contact?.phone ??
                    "",
                address:
                    data.contact?.address ??
                    "",
            },

            social: {
                facebook:
                    data.social?.facebook ??
                    "",
                instagram:
                    data.social?.instagram ??
                    "",
                linkedin:
                    data.social?.linkedin ??
                    "",
                x:
                    data.social?.x ??
                    "",
                youtube:
                    data.social?.youtube ??
                    "",
                github:
                    data.social?.github ??
                    "",
            },

            seo: {
                metaTitle:
                    data.seo?.metaTitle ??
                    "",
                metaDescription:
                    data.seo?.metaDescription ??
                    "",
                keywords:
                    data.seo?.keywords ??
                    [],
                canonicalUrl:
                    data.seo?.canonicalUrl ??
                    "",
                robots:
                    data.seo?.robots ??
                    "",
            },

            features: {
                maintenanceMode:
                    Boolean(
                        data.features
                            ?.maintenanceMode
                    ),
                consultationEnabled:
                    data.features
                        ?.consultationEnabled ??
                    true,
                careersEnabled:
                    data.features
                        ?.careersEnabled ??
                    true,
            },

            analyticsId:
                data.analyticsId ?? "",
        };
    }

    function updateBranding(
        key: keyof SettingsForm["branding"],
        value: string | null
    ) {
        setSettings((current) => ({
            ...current,
            branding: {
                ...current.branding,
                [key]: value,
            },
        }));
    }

    async function saveSettings() {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response =
                await fetch(
                    "/api/settings",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            settings
                        ),
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to save settings."
                );
            }

            setSettings(
                normalizeSettings(
                    result.data
                )
            );

            setMessage(
                "Settings saved successfully."
            );
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : "Unable to save settings."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <p className="text-sm font-bold text-blue-600">
                    System Management
                </p>

                <h1 className="mt-1 text-3xl font-black text-slate-900">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage ADM website configuration,
                    branding and global preferences.
                </p>
            </div>

            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Branding */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-black text-slate-900">
                        Branding
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Control the identity displayed across ADM.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Site name
                        </label>

                        <input
                            value={
                                settings.branding
                                    .siteName
                            }
                            onChange={(event) =>
                                setSettings(
                                    (current) => ({
                                        ...current,
                                        branding: {
                                            ...current.branding,
                                            siteName:
                                                event
                                                    .target
                                                    .value,
                                        },
                                    })
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Site description
                        </label>

                        <textarea
                            rows={4}
                            value={
                                settings.branding
                                    .siteDescription
                            }
                            onChange={(event) =>
                                setSettings(
                                    (current) => ({
                                        ...current,
                                        branding: {
                                            ...current.branding,
                                            siteDescription:
                                                event
                                                    .target
                                                    .value,
                                        },
                                    })
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <MediaPicker
                        label="Website Logo"
                        description="Select the primary ADM logo from Media Management."
                        value={
                            settings.branding.logo
                        }
                        onChange={(value) =>
                            updateBranding(
                                "logo",
                                value
                            )
                        }
                    />

                    <MediaPicker
                        label="Favicon"
                        description="Select the favicon used in the browser tab."
                        value={
                            settings.branding.favicon
                        }
                        onChange={(value) =>
                            updateBranding(
                                "favicon",
                                value
                            )
                        }
                    />
                </div>
            </section>

            {/* Contact */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-black text-slate-900">
                    Contact Information
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    <input
                        value={settings.contact.email}
                        onChange={(e) =>
                            setSettings((s) => ({
                                ...s,
                                contact: {
                                    ...s.contact,
                                    email:
                                        e.target
                                            .value,
                                },
                            }))
                        }
                        placeholder="Email"
                        className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                    />

                    <input
                        value={settings.contact.phone}
                        onChange={(e) =>
                            setSettings((s) => ({
                                ...s,
                                contact: {
                                    ...s.contact,
                                    phone:
                                        e.target
                                            .value,
                                },
                            }))
                        }
                        placeholder="Phone"
                        className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                    />

                    <textarea
                        value={settings.contact.address}
                        onChange={(e) =>
                            setSettings((s) => ({
                                ...s,
                                contact: {
                                    ...s.contact,
                                    address:
                                        e.target
                                            .value,
                                },
                            }))
                        }
                        placeholder="Address"
                        className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 md:col-span-2"
                    />
                </div>
            </section>

            {/* Features */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-black text-slate-900">
                    Website Features
                </h2>

                <div className="space-y-4">
                    {(
                        [
                            [
                                "maintenanceMode",
                                "Maintenance mode",
                                "Temporarily disable the public website.",
                            ],
                            [
                                "consultationEnabled",
                                "Consultation requests",
                                "Allow visitors to submit consultation requests.",
                            ],
                            [
                                "careersEnabled",
                                "Careers",
                                "Show career opportunities publicly.",
                            ],
                        ] as const
                    ).map(
                        ([
                            key,
                            title,
                            description,
                        ]) => (
                            <label
                                key={key}
                                className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
                            >
                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {description}
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={
                                        settings
                                            .features[
                                        key
                                        ]
                                    }
                                    onChange={(e) =>
                                        setSettings(
                                            (s) => ({
                                                ...s,
                                                features:
                                                {
                                                    ...s.features,
                                                    [key]:
                                                        e
                                                            .target
                                                            .checked,
                                                },
                                            })
                                        )
                                    }
                                    className="h-5 w-5 accent-blue-600"
                                />
                            </label>
                        )
                    )}
                </div>
            </section>

            <div className="sticky bottom-4 z-20 flex justify-end">
                <button
                    type="button"
                    onClick={
                        saveSettings
                    }
                    disabled={saving}
                    className="h-12 rounded-xl bg-blue-600 px-7 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving
                        ? "Saving..."
                        : "Save Settings"}
                </button>
            </div>
        </div>
    );
}