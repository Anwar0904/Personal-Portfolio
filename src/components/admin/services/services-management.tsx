// src/app/(admin)/admin/services/page.tsx
// Replace your current ServicesManagement component with this.

"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Edit3,
    Loader2,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import MediaPicker from "@/components/admin/media/media-picker";

type Status =
    | "draft"
    | "published"
    | "archived";

type Feature = {
    title: string;
    description: string;
};

type Faq = {
    question: string;
    answer: string;
};

type Seo = {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    robots: string;
};

type MediaRef =
    | string
    | {
        _id: string;
        url?: string;
    }
    | null;

type Service = {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description?: string;
    content?: string;
    featuredImage?: MediaRef;
    banner?: MediaRef;
    gallery?: MediaRef[];
    icon?: string | null;
    features?: Feature[];
    faqs?: Faq[];
    seo?: Partial<Seo>;
    status: Status;
    featured: boolean;
    sortOrder?: number;
};

type Form = {
    title: string;
    shortDescription: string;
    description: string;
    content: string;
    featuredImage: string | null;
    gallery: string[];
    features: Feature[];
    faqs: Faq[];
    seo: Seo;
    status: Status;
    featured: boolean;
    sortOrder: number;
};

const emptyForm = (): Form => ({
    title: "",
    shortDescription: "",
    description: "",
    content: "",
    featuredImage: null,
    gallery: [],
    features: [],
    faqs: [],
    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalUrl: "",
        robots: "index,follow",
    },
    status: "draft",
    featured: false,
    sortOrder: 0,
});

const idOf = (
    media: MediaRef | undefined
) =>
    typeof media === "string"
        ? media
        : media?._id ?? null;

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function serviceForm(
    service: Service
): Form {
    const description =
        service.description ??
        service.content ??
        "";

    return {
        title: service.title ?? "",
        shortDescription:
            service.shortDescription ?? "",
        description,
        content:
            service.content ??
            description,
        featuredImage:
            idOf(
                service.featuredImage ??
                service.banner
            ),
        gallery: (service.gallery ?? [])
            .map(idOf)
            .filter(
                (
                    id
                ): id is string =>
                    Boolean(id)
            ),
        features:
            service.features ?? [],
        faqs: service.faqs ?? [],
        seo: {
            metaTitle:
                service.seo?.metaTitle ??
                service.title ??
                "",
            metaDescription:
                service.seo?.metaDescription ??
                service.shortDescription ??
                "",
            keywords:
                service.seo?.keywords ?? [],
            canonicalUrl:
                service.seo?.canonicalUrl ??
                "",
            robots:
                service.seo?.robots ??
                "index,follow",
        },
        status:
            service.status ?? "draft",
        featured:
            service.featured ?? false,
        sortOrder:
            service.sortOrder ?? 0,
    };
}

export default function ServicesManagement() {
    const [services, setServices] =
        useState<Service[]>([]);
    const [search, setSearch] =
        useState("");
    const [loading, setLoading] =
        useState(true);
    const [saving, setSaving] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);
    const [formOpen, setFormOpen] =
        useState(false);
    const [editingId, setEditingId] =
        useState<string | null>(null);
    const [form, setForm] =
        useState<Form>(emptyForm());

    async function loadServices() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                "/api/services?limit=100&page=1",
                {
                    cache: "no-store",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to load services."
                );
            }

            const data =
                result.data;

            const list = Array.isArray(
                data
            )
                ? data
                : data?.services ?? [];

            setServices(list);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Unable to load services."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadServices();
    }, []);

    function createService() {
        setEditingId(null);
        setForm(emptyForm());
        setError(null);
        setFormOpen(true);
    }

    async function editService(
        service: Service
    ) {
        try {
            setError(null);

            const response = await fetch(
                `/api/services/${service._id}`,
                {
                    cache: "no-store",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to load this service."
                );
            }

            setEditingId(
                service._id
            );
            setForm(
                serviceForm(result.data)
            );
            setFormOpen(true);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Unable to load this service."
            );
        }
    }

    async function save(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setSaving(true);
            setError(null);

            const title =
                form.title.trim();

            const description =
                form.description.trim() ||
                form.content.trim();

            const payload = {
                title,
                slug: slugify(title),
                shortDescription:
                    form.shortDescription.trim(),
                description,
                content:
                    form.content.trim() ||
                    description,
                featuredImage:
                    form.featuredImage,
                banner:
                    form.featuredImage,
                gallery:
                    form.gallery,
                features:
                    form.features.filter(
                        (item) =>
                            item.title.trim() ||
                            item.description.trim()
                    ),
                faqs:
                    form.faqs.filter(
                        (item) =>
                            item.question.trim() ||
                            item.answer.trim()
                    ),
                seo: {
                    ...form.seo,
                    metaTitle:
                        form.seo.metaTitle.trim() ||
                        title,
                    metaDescription:
                        form.seo.metaDescription.trim() ||
                        form.shortDescription.trim(),
                },
                status: form.status,
                featured:
                    form.featured,
                sortOrder:
                    form.sortOrder,
            };

            const response = await fetch(
                editingId
                    ? `/api/services/${editingId}`
                    : "/api/services",
                {
                    method: editingId
                        ? "PATCH"
                        : "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to save service."
                );
            }

            setFormOpen(false);
            setEditingId(null);
            setForm(emptyForm());

            await loadServices();
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Unable to save service."
            );
        } finally {
            setSaving(false);
        }
    }

    async function remove(
        id: string
    ) {
        if (
            !window.confirm(
                "Delete this service?"
            )
        ) {
            return;
        }

        try {
            setError(null);

            const response = await fetch(
                `/api/services/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ??
                    "Unable to delete service."
                );
            }

            setServices(
                (current) =>
                    current.filter(
                        (service) =>
                            service._id !== id
                    )
            );
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Unable to delete service."
            );
        }
    }

    const shown = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return services.filter(
            (service) =>
                !query ||
                [
                    service.title,
                    service.slug,
                    service.shortDescription,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        value
                            .toLowerCase()
                            .includes(query)
                    )
        );
    }, [services, search]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Business
                    </p>

                    <h1 className="mt-1 text-3xl font-black text-slate-900">
                        Services
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your public services,
                        media, features, FAQs and SEO.
                    </p>
                </div>

                <button
                    onClick={
                        createService
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={17} />
                    Add Service
                </button>
            </header>

            {error && (
                <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError(null)
                        }
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="relative block max-w-lg">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search services..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </label>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />
                        Loading services…
                    </div>
                ) : shown.length ? (
                    <div className="divide-y divide-slate-100">
                        {shown.map(
                            (service) => (
                                <article
                                    key={
                                        service._id
                                    }
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-bold text-slate-900">
                                                {
                                                    service.title
                                                }
                                            </h2>

                                            {service.featured && (
                                                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                                                    FEATURED
                                                </span>
                                            )}

                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
                                                {
                                                    service.status
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                            {
                                                service.shortDescription
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            /services/
                                            {
                                                service.slug
                                            }
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() =>
                                                void editService(
                                                    service
                                                )
                                            }
                                            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                            aria-label={`Edit ${service.title}`}
                                        >
                                            <Edit3
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        <button
                                            onClick={() =>
                                                void remove(
                                                    service._id
                                                )
                                            }
                                            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                            aria-label={`Delete ${service.title}`}
                                        >
                                            <Trash2
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <h3 className="font-bold text-slate-900">
                            No services found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first service
                            to make it available here.
                        </p>
                    </div>
                )}
            </section>

            {formOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
                    <form
                        onSubmit={save}
                        className="mx-auto my-3 max-w-5xl space-y-6 rounded-3xl bg-white p-5 shadow-2xl sm:my-6 sm:p-8"
                    >
                        <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-start justify-between gap-4 border-b bg-white p-5 sm:-mx-8 sm:-mt-8 sm:p-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editingId
                                        ? "Edit service"
                                        : "New service"}
                                </p>

                                <h2 className="mt-1 text-2xl font-black text-slate-900">
                                    Service editor
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormOpen(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Service name">
                                <input
                                    required
                                    minLength={3}
                                    value={
                                        form.title
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                title: event
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <Field label="Status">
                                <select
                                    value={
                                        form.status
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                status: event
                                                    .target
                                                    .value as Status,
                                            }
                                        )
                                    }
                                    className="input"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>
                                    <option value="published">
                                        Published
                                    </option>
                                    <option value="archived">
                                        Archived
                                    </option>
                                </select>
                            </Field>
                        </div>

                        <Field label="Short description">
                            <textarea
                                required
                                minLength={10}
                                maxLength={300}
                                value={
                                    form.shortDescription
                                }
                                onChange={(
                                    event
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            shortDescription:
                                                event
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                rows={3}
                                className="input min-h-24"
                            />
                        </Field>

                        <Field label="Service description">
                            <textarea
                                required
                                minLength={20}
                                value={
                                    form.description
                                }
                                onChange={(
                                    event
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            description:
                                                event
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                rows={6}
                                className="input min-h-40"
                            />
                        </Field>

                        <Field label="Full service content">
                            <textarea
                                required
                                minLength={20}
                                value={
                                    form.content
                                }
                                onChange={(
                                    event
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            content:
                                                event
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                rows={8}
                                className="input min-h-48"
                            />
                        </Field>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <MediaPicker
                                value={
                                    form.featuredImage
                                }
                                onChange={(
                                    featuredImage
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            featuredImage,
                                        }
                                    )
                                }
                                label="Featured image"
                                description="Primary visual used on service cards."
                                accept="image"
                            />

                            <div className="space-y-3">
                                <MediaPicker
                                    value={null}
                                    onChange={(
                                        id
                                    ) => {
                                        if (
                                            id &&
                                            !form.gallery.includes(
                                                id
                                            )
                                        ) {
                                            setForm(
                                                {
                                                    ...form,
                                                    gallery:
                                                        [
                                                            ...form.gallery,
                                                            id,
                                                        ],
                                                }
                                            );
                                        }
                                    }}
                                    label="Gallery images"
                                    description="Add supporting service images."
                                    accept="image"
                                />

                                {form.gallery.length >
                                    0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {form.gallery.map(
                                                (
                                                    id
                                                ) => (
                                                    <button
                                                        key={
                                                            id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setForm(
                                                                {
                                                                    ...form,
                                                                    gallery:
                                                                        form.gallery.filter(
                                                                            (
                                                                                galleryId
                                                                            ) =>
                                                                                galleryId !==
                                                                                id
                                                                        ),
                                                                }
                                                            )
                                                        }
                                                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Remove image
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Sort order">
                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        form.sortOrder
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                sortOrder:
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    ),
                                            }
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-3">
                                <input
                                    type="checkbox"
                                    checked={
                                        form.featured
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                featured:
                                                    event
                                                        .target
                                                        .checked,
                                            }
                                        )
                                    }
                                />

                                <span className="text-sm font-bold text-slate-800">
                                    Feature this service
                                </span>
                            </label>
                        </div>

                        <Features
                            value={
                                form.features
                            }
                            onChange={(
                                features
                            ) =>
                                setForm({
                                    ...form,
                                    features,
                                })
                            }
                        />

                        <Faqs
                            value={
                                form.faqs
                            }
                            onChange={(faqs) =>
                                setForm({
                                    ...form,
                                    faqs,
                                })
                            }
                        />

                        <section className="space-y-4 rounded-2xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900">
                                SEO
                            </h3>

                            <Field label="Meta title">
                                <input
                                    required
                                    value={
                                        form.seo
                                            .metaTitle
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                seo: {
                                                    ...form.seo,
                                                    metaTitle:
                                                        event
                                                            .target
                                                            .value,
                                                },
                                            }
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <Field label="Meta description">
                                <textarea
                                    required
                                    value={
                                        form.seo
                                            .metaDescription
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                seo: {
                                                    ...form.seo,
                                                    metaDescription:
                                                        event
                                                            .target
                                                            .value,
                                                },
                                            }
                                        )
                                    }
                                    rows={3}
                                    className="input"
                                />
                            </Field>

                            <Field label="Keywords">
                                <input
                                    value={form.seo.keywords.join(
                                        ", "
                                    )}
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                seo: {
                                                    ...form.seo,
                                                    keywords:
                                                        event
                                                            .target
                                                            .value
                                                            .split(
                                                                ","
                                                            )
                                                            .map(
                                                                (
                                                                    item
                                                                ) =>
                                                                    item.trim()
                                                            )
                                                            .filter(
                                                                Boolean
                                                            ),
                                                },
                                            }
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <Field label="Canonical URL">
                                <input
                                    value={
                                        form.seo
                                            .canonicalUrl
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setForm(
                                            {
                                                ...form,
                                                seo: {
                                                    ...form.seo,
                                                    canonicalUrl:
                                                        event
                                                            .target
                                                            .value,
                                                },
                                            }
                                        )
                                    }
                                    className="input"
                                />
                            </Field>
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormOpen(
                                        false
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={
                                    saving
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white disabled:opacity-60"
                            >
                                {saving && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                {editingId
                                    ? "Save changes"
                                    : "Create service"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">
                {label}
            </span>
            {children}
        </label>
    );
}

function Features({
    value,
    onChange,
}: {
    value: Feature[];
    onChange: (
        value: Feature[]
    ) => void;
}) {
    return (
        <section className="space-y-3 rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">
                    Key features
                </h3>

                <button
                    type="button"
                    onClick={() =>
                        onChange([
                            ...value,
                            {
                                title: "",
                                description:
                                    "",
                            },
                        ])
                    }
                    className="text-sm font-bold text-blue-600"
                >
                    + Add feature
                </button>
            </div>

            {value.map(
                (
                    feature,
                    index
                ) => (
                    <div
                        key={index}
                        className="grid gap-3 md:grid-cols-[1fr_2fr_auto]"
                    >
                        <input
                            value={
                                feature.title
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    value.map(
                                        (
                                            item,
                                            itemIndex
                                        ) =>
                                            itemIndex ===
                                                index
                                                ? {
                                                    ...item,
                                                    title: event
                                                        .target
                                                        .value,
                                                }
                                                : item
                                    )
                                )
                            }
                            placeholder="Feature title"
                            className="input"
                        />

                        <input
                            value={
                                feature.description
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    value.map(
                                        (
                                            item,
                                            itemIndex
                                        ) =>
                                            itemIndex ===
                                                index
                                                ? {
                                                    ...item,
                                                    description:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                                : item
                                    )
                                )
                            }
                            placeholder="Feature description"
                            className="input"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                onChange(
                                    value.filter(
                                        (
                                            _,
                                            itemIndex
                                        ) =>
                                            itemIndex !==
                                            index
                                    )
                                )
                            }
                            className="text-sm text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                )
            )}
        </section>
    );
}

function Faqs({
    value,
    onChange,
}: {
    value: Faq[];
    onChange: (
        value: Faq[]
    ) => void;
}) {
    return (
        <section className="space-y-3 rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">
                    FAQs
                </h3>

                <button
                    type="button"
                    onClick={() =>
                        onChange([
                            ...value,
                            {
                                question: "",
                                answer: "",
                            },
                        ])
                    }
                    className="text-sm font-bold text-blue-600"
                >
                    + Add FAQ
                </button>
            </div>

            {value.map(
                (
                    faq,
                    index
                ) => (
                    <div
                        key={index}
                        className="grid gap-3 md:grid-cols-[1fr_2fr_auto]"
                    >
                        <input
                            value={
                                faq.question
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    value.map(
                                        (
                                            item,
                                            itemIndex
                                        ) =>
                                            itemIndex ===
                                                index
                                                ? {
                                                    ...item,
                                                    question:
                                                        event
                                                            .target
                                                            .value,
                                                }
                                                : item
                                    )
                                )
                            }
                            placeholder="Question"
                            className="input"
                        />

                        <input
                            value={
                                faq.answer
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    value.map(
                                        (
                                            item,
                                            itemIndex
                                        ) =>
                                            itemIndex ===
                                                index
                                                ? {
                                                    ...item,
                                                    answer: event
                                                        .target
                                                        .value,
                                                }
                                                : item
                                    )
                                )
                            }
                            placeholder="Answer"
                            className="input"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                onChange(
                                    value.filter(
                                        (
                                            _,
                                            itemIndex
                                        ) =>
                                            itemIndex !==
                                            index
                                    )
                                )
                            }
                            className="text-sm text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                )
            )}
        </section>
    );
}