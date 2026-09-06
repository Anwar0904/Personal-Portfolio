"use client";

import {
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Edit3,
    Hash,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ContentStatus =
    | "draft"
    | "published"
    | "archived";

type Tag = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    status: ContentStatus;
    createdAt: string;
    updatedAt: string;
};

type TagsResponse = {
    tags: Tag[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type ApiResponse<T> = {
    success?: boolean;
    message?: string;
    data?: T;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatDate(date: string) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function getStatusLabel(status: ContentStatus) {
    switch (status) {
        case "published":
            return "Published";

        case "archived":
            return "Archived";

        default:
            return "Draft";
    }
}

function getStatusClasses(status: ContentStatus) {
    switch (status) {
        case "published":
            return "bg-emerald-50 text-emerald-700";

        case "archived":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-amber-50 text-amber-700";
    }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function TagsManagement() {
    /* ------------------------------- Data -------------------------------- */

    const [tags, setTags] = useState<Tag[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    /* ----------------------------- Search -------------------------------- */

    const [search, setSearch] =
        useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    /* --------------------------- Pagination ------------------------------ */

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(20);

    const [total, setTotal] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(1);

    /* ------------------------------ Modal -------------------------------- */

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Tag | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Tag | null>(null);

    /* ------------------------------- Form -------------------------------- */

    const [name, setName] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [color, setColor] =
        useState("#3B82F6");

    const [status, setStatus] =
        useState<ContentStatus>("draft");

    const [slugEdited, setSlugEdited] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    /* ---------------------------------------------------------------------- */
    /* Debounce search                                                        */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(
                search.trim()
            );

            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    /* ---------------------------------------------------------------------- */
    /* Fetch tags                                                             */
    /* ---------------------------------------------------------------------- */

    const fetchTags = useCallback(
        async (
            showRefreshLoader = false
        ) => {
            try {
                if (showRefreshLoader) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(page)
                );

                params.set(
                    "limit",
                    String(limit)
                );

                if (debouncedSearch) {
                    params.set(
                        "search",
                        debouncedSearch
                    );
                }

                params.set(
                    "sort",
                    "-createdAt"
                );

                const response =
                    await fetch(
                        `/api/tags?${params.toString()}`,
                        {
                            method: "GET",
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResponse<TagsResponse>;

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch tags."
                    );
                }

                const data =
                    result.data;

                if (!data) {
                    throw new Error(
                        "Invalid tags response."
                    );
                }

                setTags(
                    data.tags ?? []
                );

                setTotal(
                    data.pagination?.total ??
                    0
                );

                setTotalPages(
                    data.pagination
                        ?.totalPages ?? 1
                );
            } catch (err) {
                console.error(
                    "Failed to fetch tags:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch tags."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            page,
            limit,
            debouncedSearch,
        ]
    );

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    /* ---------------------------------------------------------------------- */
    /* Stats                                                                  */
    /* ---------------------------------------------------------------------- */

    const publishedCount =
        useMemo(
            () =>
                tags.filter(
                    (tag) =>
                        tag.status ===
                        "published"
                ).length,
            [tags]
        );

    const draftCount =
        useMemo(
            () =>
                tags.filter(
                    (tag) =>
                        tag.status ===
                        "draft"
                ).length,
            [tags]
        );

    /* ---------------------------------------------------------------------- */
    /* Form helpers                                                           */
    /* ---------------------------------------------------------------------- */

    function resetForm() {
        setName("");
        setSlug("");
        setDescription("");
        setColor("#3B82F6");
        setStatus("draft");
        setSlugEdited(false);
        setEditing(null);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(tag: Tag) {
        setEditing(tag);

        setName(tag.name);
        setSlug(tag.slug);
        setDescription(
            tag.description ?? ""
        );

        setColor(
            tag.color || "#3B82F6"
        );

        setStatus(
            tag.status || "draft"
        );

        setSlugEdited(true);
        setShowForm(true);
    }

    function closeForm() {
        if (submitting) return;

        setShowForm(false);
        resetForm();
    }

    function handleNameChange(
        value: string
    ) {
        setName(value);

        if (!slugEdited) {
            setSlug(
                createSlug(value)
            );
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Create / Update                                                        */
    /* ---------------------------------------------------------------------- */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanName =
            name.trim();

        const cleanSlug =
            slug.trim() ||
            createSlug(cleanName);

        if (
            !cleanName ||
            !cleanSlug
        ) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const payload = {
                name: cleanName,
                slug: cleanSlug,
                description:
                    description.trim(),
                color,
                status,
            };

            const url = editing
                ? `/api/tags/${editing._id}`
                : "/api/tags";

            const method = editing
                ? "PATCH"
                : "POST";

            const response =
                await fetch(url, {
                    method,
                    credentials:
                        "include",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        payload
                    ),
                });

            const result =
                (await response.json()) as ApiResponse<Tag>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to save tag."
                );
            }

            setShowForm(false);
            resetForm();

            /*
             * Refresh from MongoDB instead
             * of trusting local state.
             */
            await fetchTags();
        } catch (err) {
            console.error(
                "Failed to save tag:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save tag."
            );
        } finally {
            setSubmitting(false);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Delete                                                                 */
    /* ---------------------------------------------------------------------- */

    async function deleteTag() {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            setError("");

            const response =
                await fetch(
                    `/api/tags/${deleteTarget._id}`,
                    {
                        method: "DELETE",
                        credentials:
                            "include",
                    }
                );

            const result =
                (await response.json()) as ApiResponse<null>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to delete tag."
                );
            }

            setDeleteTarget(null);

            await fetchTags();
        } catch (err) {
            console.error(
                "Failed to delete tag:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete tag."
            );
        } finally {
            setDeleting(false);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Status change                                                          */
    /* ---------------------------------------------------------------------- */

    async function changeStatus(
        tag: Tag,
        newStatus: ContentStatus
    ) {
        try {
            setError("");

            const response =
                await fetch(
                    `/api/tags/${tag._id}/status`,
                    {
                        method: "PATCH",
                        credentials:
                            "include",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            status: newStatus,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResponse<Tag>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to update status."
                );
            }

            /*
             * Update the visible row immediately.
             */
            setTags((current) =>
                current.map((item) =>
                    item._id === tag._id
                        ? {
                            ...item,
                            status:
                                newStatus,
                        }
                        : item
                )
            );
        } catch (err) {
            console.error(
                "Failed to update status:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update status."
            );
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Content
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Tags
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage article tags used
                        to improve content discovery
                        and filtering.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() =>
                            fetchTags(true)
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                    <button
                        onClick={
                            openCreate
                        }
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Plus size={18} />

                        Add Tag
                    </button>
                </div>
            </section>

            {/* Error */}

            {error && (
                <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    <div>
                        <p className="font-bold">
                            Something went wrong
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setError("")
                        }
                        className="rounded-lg p-1 hover:bg-red-100"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Tags
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {total}
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
                        Drafts
                    </p>

                    <p className="mt-2 text-3xl font-black text-amber-600">
                        {draftCount}
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
                        placeholder="Search tags..."
                        className="h-11 text-black w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </section>

            {/* Loading */}

            {loading ? (
                <section className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="text-center">
                        <Loader2
                            size={34}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-4 text-sm font-semibold text-slate-600">
                            Loading tags...
                        </p>
                    </div>
                </section>
            ) : (
                <>
                    {/* Desktop */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[850px]">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70">
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Tag
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Slug
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Created
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {tags.map(
                                        (
                                            tag
                                        ) => (
                                            <tr
                                                key={
                                                    tag._id
                                                }
                                                className="transition hover:bg-slate-50/70"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                                                            style={{
                                                                backgroundColor:
                                                                    `${tag.color}15`,
                                                                color: tag.color,
                                                            }}
                                                        >
                                                            <Hash
                                                                size={
                                                                    18
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <span className="font-bold text-slate-900">
                                                                {
                                                                    tag.name
                                                                }
                                                            </span>

                                                            {tag.description && (
                                                                <p className="mt-1 max-w-md truncate text-xs text-slate-400">
                                                                    {
                                                                        tag.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                                                        {
                                                            tag.slug
                                                        }
                                                    </code>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <select
                                                        value={
                                                            tag.status
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            changeStatus(
                                                                tag,
                                                                event
                                                                    .target
                                                                    .value as ContentStatus
                                                            )
                                                        }
                                                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold outline-none ${getStatusClasses(
                                                            tag.status
                                                        )}`}
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
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {formatDate(
                                                        tag.createdAt
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() =>
                                                                openEdit(
                                                                    tag
                                                                )
                                                            }
                                                            className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                            title="Edit tag"
                                                        >
                                                            <Edit3
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    tag
                                                                )
                                                            }
                                                            className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                            title="Delete tag"
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
                            {tags.map(
                                (
                                    tag
                                ) => (
                                    <article
                                        key={
                                            tag._id
                                        }
                                        className="p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                                style={{
                                                    backgroundColor:
                                                        `${tag.color}15`,
                                                    color: tag.color,
                                                }}
                                            >
                                                <Hash
                                                    size={
                                                        18
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900">
                                                            {
                                                                tag.name
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                tag.slug
                                                            }
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
                                                            tag.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            tag.status
                                                        )}
                                                    </span>
                                                </div>

                                                {tag.description && (
                                                    <p className="mt-3 text-xs leading-5 text-slate-500">
                                                        {
                                                            tag.description
                                                        }
                                                    </p>
                                                )}

                                                <p className="mt-3 text-xs text-slate-400">
                                                    Created{" "}
                                                    {formatDate(
                                                        tag.createdAt
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            tag
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
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            tag
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
                                    </article>
                                )
                            )}
                        </div>

                        {!tags.length && (
                            <div className="py-20 text-center">
                                <Hash
                                    size={36}
                                    className="mx-auto text-slate-300"
                                />

                                <h3 className="mt-4 font-black text-slate-900">
                                    No tags found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    {debouncedSearch
                                        ? "Try another search term."
                                        : "Create your first tag to get started."}
                                </p>

                                {!debouncedSearch && (
                                    <button
                                        onClick={
                                            openCreate
                                        }
                                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
                                    >
                                        <Plus
                                            size={
                                                16
                                            }
                                        />
                                        Add Tag
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Pagination */}

                    {totalPages >
                        1 && (
                            <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                                <p className="text-sm text-slate-500">
                                    Page{" "}
                                    <strong className="text-slate-700">
                                        {page}
                                    </strong>{" "}
                                    of{" "}
                                    <strong className="text-slate-700">
                                        {
                                            totalPages
                                        }
                                    </strong>
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        disabled={
                                            page ===
                                            1
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        current -
                                                        1
                                                    )
                                            )
                                        }
                                        className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        disabled={
                                            page >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.min(
                                                        totalPages,
                                                        current +
                                                        1
                                                    )
                                            )
                                        }
                                        className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </section>
                        )}
                </>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Create / Edit Modal                                             */}
            {/* ---------------------------------------------------------------- */}

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
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editing
                                        ? "Edit"
                                        : "Create"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Tag"
                                        : "New Tag"}
                                </h2>
                            </div>

                            <button
                                onClick={
                                    closeForm
                                }
                                disabled={
                                    submitting
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
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
                            {/* Name */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Tag Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        handleNameChange(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. Artificial Intelligence"
                                    required
                                    disabled={
                                        submitting
                                    }
                                    className="h-12 w-full text-black rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />
                            </div>

                            {/* Slug */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Slug
                                </label>

                                <input
                                    value={slug}
                                    onChange={(event) => {
                                        setSlug(
                                            createSlug(
                                                event
                                                    .target
                                                    .value
                                            )
                                        );

                                        setSlugEdited(
                                            true
                                        );
                                    }}
                                    placeholder="artificial-intelligence"
                                    required
                                    disabled={
                                        submitting
                                    }
                                    className="h-12 w-full text-black rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Automatically generated
                                    from the tag name unless
                                    manually changed.
                                </p>
                            </div>

                            {/* Description */}

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
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={3}
                                    maxLength={
                                        500
                                    }
                                    placeholder="Optional description..."
                                    disabled={
                                        submitting
                                    }
                                    className="w-full text-black resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
                                />

                                <p className="mt-1 text-right text-xs text-slate-400">
                                    {
                                        description.length
                                    }{" "}
                                    / 500
                                </p>
                            </div>

                            {/* Color + Status */}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Tag Color
                                    </label>

                                    <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3">
                                        <input
                                            type="color"
                                            value={
                                                color
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setColor(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                submitting
                                            }
                                            className="h-8 w-8 text-black cursor-pointer rounded-lg border-0 bg-transparent p-0"
                                        />

                                        <input
                                            value={
                                                color
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setColor(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                submitting
                                            }
                                            className="min-w-0 text-black flex-1 bg-transparent text-sm font-medium uppercase outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        value={
                                            status
                                        }
                                        onChange={(event) =>
                                            setStatus(
                                                event
                                                    .target
                                                    .value as ContentStatus
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                                </div>
                            </div>

                            {/* Actions */}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting && (
                                        <Loader2
                                            size={
                                                16
                                            }
                                            className="animate-spin"
                                        />
                                    )}

                                    {editing
                                        ? "Save Changes"
                                        : "Create Tag"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Delete Modal                                                    */}
            {/* ---------------------------------------------------------------- */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete tag?
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

                        <p className="mt-2 text-xs leading-5 text-slate-400">
                            The tag will be
                            soft-deleted from the
                            database and removed from
                            the active tags list.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={
                                    deleting
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    deleteTag
                                }
                                disabled={
                                    deleting
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting && (
                                    <Loader2
                                        size={
                                            16
                                        }
                                        className="animate-spin"
                                    />
                                )}

                                Delete Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}