"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import Link from "next/link";
import {
    Check,
    ChevronLeft,
    Edit3,
    Folder,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Category = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    status?: "draft" | "published" | "archived";
    posts?: number;
    createdAt: string;
};

type ApiResponse<T> = {
    success?: boolean;
    data?: T;
    message?: string;
};

type CategoryListResponse =
    | Category[]
    | {
        categories?: Category[];
    };

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getCategoriesFromResponse(
    body: ApiResponse<CategoryListResponse>
): Category[] {
    if (Array.isArray(body.data)) {
        return body.data;
    }

    return body.data?.categories ?? [];
}

function getErrorMessage(
    body: unknown,
    fallback: string
) {
    if (
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
    ) {
        return body.message;
    }

    return fallback;
}

export default function CategoriesManagement() {
    const [categories, setCategories] =
        useState<Category[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Category | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Category | null>(null);

    const [name, setName] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState<"draft" | "published" | "archived">(
            "draft"
        );

    const [slugManuallyEdited, setSlugManuallyEdited] =
        useState(false);

    async function loadCategories() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                "/api/categories",
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const body =
                (await response.json()) as ApiResponse<CategoryListResponse>;

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        body,
                        "Unable to load categories."
                    )
                );
            }

            setCategories(
                getCategoriesFromResponse(body)
            );
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : "Unable to load categories."
            );
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    const filteredCategories =
        useMemo(() => {
            const query =
                search.trim().toLowerCase();

            if (!query) {
                return categories;
            }

            return categories.filter(
                (category) =>
                    category.name
                        .toLowerCase()
                        .includes(query) ||
                    category.slug
                        .toLowerCase()
                        .includes(query) ||
                    (
                        category.description ??
                        ""
                    )
                        .toLowerCase()
                        .includes(query)
            );
        }, [categories, search]);

    const totalArticles =
        categories.reduce(
            (total, category) =>
                total +
                Number(category.posts ?? 0),
            0
        );

    const publishedCount =
        categories.filter(
            (category) =>
                category.status === "published"
        ).length;

    function resetForm() {
        setName("");
        setSlug("");
        setDescription("");
        setStatus("draft");
        setEditing(null);
        setSlugManuallyEdited(false);
    }

    function openCreate() {
        resetForm();
        setError(null);
        setSuccess(null);
        setShowForm(true);
    }

    function openEdit(
        category: Category
    ) {
        setEditing(category);
        setName(category.name);
        setSlug(category.slug);
        setDescription(
            category.description ?? ""
        );
        setStatus(category.status ?? "draft");
        setSlugManuallyEdited(true);
        setError(null);
        setSuccess(null);
        setShowForm(true);
    }

    function closeForm() {
        if (saving) return;

        setShowForm(false);
        resetForm();
    }

    function handleNameChange(
        value: string
    ) {
        setName(value);

        if (!slugManuallyEdited) {
            setSlug(createSlug(value));
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanName =
            name.trim();

        const cleanSlug =
            createSlug(
                slug.trim() ||
                cleanName
            );

        const cleanDescription =
            description.trim();

        if (!cleanName) {
            setError(
                "Category name is required."
            );
            return;
        }

        if (!cleanSlug) {
            setError(
                "A valid category slug is required."
            );
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                name: cleanName,
                slug: cleanSlug,
                description:
                    cleanDescription,
                status,
            };

            const response =
                await fetch(
                    editing
                        ? `/api/categories/${editing._id}`
                        : "/api/categories",
                    {
                        method: editing
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

            const body =
                (await response.json()) as ApiResponse<Category>;

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        body,
                        editing
                            ? "Unable to update category."
                            : "Unable to create category."
                    )
                );
            }

            await loadCategories();

            setSuccess(
                editing
                    ? "Category updated successfully."
                    : "Category created successfully."
            );

            setShowForm(false);
            resetForm();
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;

        setDeleting(true);
        setError(null);
        setSuccess(null);

        try {
            const response =
                await fetch(
                    `/api/categories/${deleteTarget._id}`,
                    {
                        method: "DELETE",
                    }
                );

            const body =
                (await response.json()) as ApiResponse<null>;

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        body,
                        "Unable to delete category."
                    )
                );
            }

            setCategories(
                (current) =>
                    current.filter(
                        (category) =>
                            category._id !==
                            deleteTarget._id
                    )
            );

            setSuccess(
                "Category deleted successfully."
            );

            setDeleteTarget(null);
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : "Unable to delete category."
            );
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link
                        href="/admin/blogs"
                        className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-blue-600"
                    >
                        <ChevronLeft size={14} />
                        Blogs
                    </Link>

                    <p className="text-sm font-semibold text-blue-600">
                        Content
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Categories
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Manage the categories used
                        across ADM content.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={loadCategories}
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>
            </section>

            {/* Feedback */}

            {error && (
                <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError(null)
                        }
                        className="shrink-0"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess(null)
                        }
                        className="shrink-0"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Categories
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {categories.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Published
                    </p>

                    <p className="mt-2 text-3xl font-black text-emerald-600">
                        {publishedCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Articles Assigned
                    </p>

                    <p className="mt-2 text-3xl font-black text-blue-600">
                        {totalArticles}
                    </p>
                </div>
            </section>

            {/* Search */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative max-w-lg">
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
                        placeholder="Search categories..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </section>

            {/* Loading */}

            {loading ? (
                <section className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                        <Loader2
                            size={30}
                            className="animate-spin text-blue-600"
                        />

                        <p className="text-sm font-semibold">
                            Loading categories...
                        </p>
                    </div>
                </section>
            ) : (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Desktop */}

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Slug
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Articles
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredCategories.map(
                                    (category) => (
                                        <tr
                                            key={
                                                category._id
                                            }
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Folder
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-900">
                                                            {
                                                                category.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 max-w-sm truncate text-xs text-slate-400">
                                                            {
                                                                category.description ||
                                                                "No description"
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                                                    /
                                                    {
                                                        category.slug
                                                    }
                                                </code>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                                {
                                                    category.posts ??
                                                    0
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={[
                                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize",
                                                        category.status ===
                                                            "published"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-slate-100 text-slate-500",
                                                    ].join(
                                                        " "
                                                    )}
                                                >
                                                    {category.status ?? "draft"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-xl p-2.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <Edit3
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}

                    <div className="divide-y divide-slate-100 md:hidden">
                        {filteredCategories.map(
                            (category) => (
                                <article
                                    key={
                                        category._id
                                    }
                                    className="p-4"
                                >
                                    <div className="flex gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Folder
                                                size={
                                                    19
                                                }
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-900">
                                                        {
                                                            category.name
                                                        }
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs text-slate-400">
                                                        /
                                                        {
                                                            category.slug
                                                        }
                                                    </p>
                                                </div>

                                                <span
                                                    className={[
                                                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                                                        category.status ===
                                                            "published"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-slate-100 text-slate-500",
                                                    ].join(
                                                        " "
                                                    )}
                                                >
                                                    {category.status ?? "draft"}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm leading-5 text-slate-500">
                                                {
                                                    category.description ||
                                                    "No description"
                                                }
                                            </p>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-400">
                                                    {
                                                        category.posts ??
                                                        0
                                                    }{" "}
                                                    articles
                                                </span>

                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Edit3
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        )}
                    </div>

                    {!filteredCategories.length && (
                        <div className="py-20 text-center">
                            <Folder
                                size={38}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 font-black text-slate-900">
                                No categories found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                {search
                                    ? "Try a different search term."
                                    : "Create your first category."}
                            </p>

                            {!search && (
                                <button
                                    type="button"
                                    onClick={
                                        openCreate
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                                >
                                    <Plus
                                        size={16}
                                    />
                                    Add Category
                                </button>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Create / Edit */}

            {showForm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeForm();
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white/80 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editing
                                        ? "Edit"
                                        : "Create"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Category"
                                        : "New Category"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                disabled={saving}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        handleNameChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Artificial Intelligence"
                                    required
                                    disabled={saving}
                                    className="h-12 w-full text-black rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Slug
                                </label>

                                <input
                                    value={slug}
                                    onChange={(event) => {
                                        setSlug(
                                            createSlug(
                                                event.target.value
                                            )
                                        );
                                        setSlugManuallyEdited(
                                            true
                                        );
                                    }}
                                    placeholder="artificial-intelligence"
                                    required
                                    disabled={saving}
                                    className="h-12 w-full text-black rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Automatically generated
                                    from the name unless
                                    manually changed.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    disabled={saving}
                                    placeholder="Briefly describe this category..."
                                    className="w-full text-black resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Status
                                </label>

                                <div className="grid grid-cols-2 gap-2">
                                    {(
                                        [
                                            "draft",
                                            "published",
                                            "archived",
                                        ] as const
                                    ).map(
                                        (value) => (
                                            <button
                                                key={
                                                    value
                                                }
                                                type="button"
                                                disabled={
                                                    saving
                                                }
                                                onClick={() =>
                                                    setStatus(
                                                        value
                                                    )
                                                }
                                                className={[
                                                    "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold capitalize transition",
                                                    status ===
                                                        value
                                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-50",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {status ===
                                                    value && (
                                                        <Check
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    )}

                                                {
                                                    value
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={saving}
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2
                                            size={
                                                16
                                            }
                                            className="animate-spin"
                                        />
                                    )}

                                    {editing
                                        ? "Save Changes"
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            You are about to delete{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.name
                                }
                            </strong>
                            .
                        </p>

                        {(deleteTarget.posts ??
                            0) > 0 && (
                                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                                    This category currently
                                    has{" "}
                                    {
                                        deleteTarget.posts
                                    }{" "}
                                    assigned articles.
                                    Your backend should
                                    reject deletion or
                                    handle reassignment.
                                </div>
                            )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={
                                    deleting
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDelete
                                }
                                disabled={
                                    deleting
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting && (
                                    <Loader2
                                        size={
                                            16
                                        }
                                        className="animate-spin"
                                    />
                                )}

                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}