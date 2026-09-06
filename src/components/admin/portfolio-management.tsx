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
    ExternalLink,
    FileText,
    FolderKanban,
    Image as ImageIcon,
    Loader2,
    Plus,
    Search,
    Trash2,
    Upload,
    Video,
    X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ProjectStatus = "Published" | "Draft";

type MediaType = "image" | "video" | "document";

type Media = {
    _id: string;
    name: string;
    originalName: string;
    publicId?: string;
    url: string;
    type: MediaType;
    mimeType: string;
    size: number;
    alt?: string;
    folder?: string;
    uploadedBy?: {
        _id: string;
        name: string;
        email: string;
    } | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

type Category = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    status?: string;
    isActive?: boolean;
};

type Project = {
    _id: string;

    title: string;
    slug: string;

    clientName: string;

    category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
    };

    shortDescription: string;

    content?: string;

    featuredImage:
    | string
    | Media
    | null;

    gallery?: Media[];

    services?: string[];

    status: ProjectStatus;

    featured: boolean;

    year: number;

    createdAt?: string;
    updatedAt?: string;
};

/* =========================================================
   API RESPONSE
========================================================= */

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getCategoryName(
    category: Project["category"]
) {
    if (typeof category === "string") {
        return category;
    }

    return category?.name || "";
}

function getMediaUrl(media?: Media | null) {
    if (!media) return "";

    return media.url;
}

function formatFileSize(size: number) {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PortfolioManagement() {
    /* -----------------------------------------------------
       DATA
    ----------------------------------------------------- */

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [categories, setCategories] =
        useState<Category[]>([]);

    /* -----------------------------------------------------
       UI STATE
    ----------------------------------------------------- */

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"All" | ProjectStatus>("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Project | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Project | null>(null);

    const [showMediaPicker, setShowMediaPicker] =
        useState(false);

    /* -----------------------------------------------------
       LOADING
    ----------------------------------------------------- */

    const [loading, setLoading] =
        useState(true);

    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [mediaLoading, setMediaLoading] =
        useState(false);

    const [uploadingMedia, setUploadingMedia] =
        useState(false);

    /* -----------------------------------------------------
       ERRORS
    ----------------------------------------------------- */

    const [error, setError] =
        useState("");

    const [formError, setFormError] =
        useState("");

    /* -----------------------------------------------------
       FORM
    ----------------------------------------------------- */

    const [title, setTitle] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [client, setClient] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState<ProjectStatus>("Draft");

    const [featured, setFeatured] =
        useState(false);

    const [year, setYear] =
        useState("2026");

    const [featuredImage, setFeaturedImage] =
        useState<Media | null>(null);

    const [slugEdited, setSlugEdited] =
        useState(false);

    /* -----------------------------------------------------
       MEDIA
    ----------------------------------------------------- */

    const [media, setMedia] =
        useState<Media[]>([]);

    const [mediaSearch, setMediaSearch] =
        useState("");

    /* =====================================================
       FETCH PROJECTS
    ===================================================== */

    const fetchProjects = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const params =
                    new URLSearchParams();

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (
                    statusFilter !==
                    "All"
                ) {
                    params.set(
                        "status",
                        statusFilter
                    );
                }

                params.set("page", "1");
                params.set("limit", "100");

                const response =
                    await fetch(
                        `/api/portfolio?${params.toString()}`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResponse<any>;

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch projects."
                    );
                }

                /*
                 * Supports either:
                 *
                 * data: []
                 *
                 * or:
                 *
                 * data: {
                 *   items: []
                 * }
                 */

                const data =
                    result.data;

                if (
                    Array.isArray(data)
                ) {
                    setProjects(data);
                } else {
                    setProjects(
                        data?.items ||
                        data?.projects ||
                        data?.results ||
                        []
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch projects."
                );
            } finally {
                setLoading(false);
            }
        },
        [search, statusFilter]
    );

    /* =====================================================
       FETCH CATEGORIES
    ===================================================== */

    const fetchCategories =
        useCallback(async () => {
            try {
                setCategoriesLoading(true);

                const response =
                    await fetch(
                        "/api/categories",
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResponse<any>;

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch categories."
                    );
                }

                const data =
                    result.data;

                const categoryList =
                    Array.isArray(data)
                        ? data
                        : data?.items ||
                        data?.categories ||
                        data?.results ||
                        [];

                setCategories(
                    categoryList.filter(
                        (item: Category) =>
                            item.isActive !==
                            false &&
                            item.status !==
                            "Inactive"
                    )
                );
            } catch (err) {
                setFormError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load categories."
                );
            } finally {
                setCategoriesLoading(false);
            }
        }, []);

    /* =====================================================
       FETCH MEDIA
    ===================================================== */

    const fetchMedia =
        useCallback(async () => {
            try {
                setMediaLoading(true);

                const params =
                    new URLSearchParams();

                if (
                    mediaSearch.trim()
                ) {
                    params.set(
                        "search",
                        mediaSearch.trim()
                    );
                }

                params.set(
                    "type",
                    "image"
                );

                const response =
                    await fetch(
                        `/api/media?${params.toString()}`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResponse<any>;

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch media."
                    );
                }

                const data =
                    result.data;

                setMedia(
                    Array.isArray(data)
                        ? data
                        : data?.items ||
                        data?.media ||
                        data?.results ||
                        []
                );
            } catch (err) {
                setFormError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch media."
                );
            } finally {
                setMediaLoading(false);
            }
        }, [mediaSearch]);

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    /* =====================================================
       STATS
    ===================================================== */

    const stats = useMemo(() => {
        return {
            total: projects.length,

            published: projects.filter(
                (project) =>
                    project.status ===
                    "Published"
            ).length,

            drafts: projects.filter(
                (project) =>
                    project.status ===
                    "Draft"
            ).length,

            featured: projects.filter(
                (project) =>
                    project.featured
            ).length,
        };
    }, [projects]);

    /* =====================================================
       FORM RESET
    ===================================================== */

    function resetForm() {
        setTitle("");
        setSlug("");
        setClient("");

        setCategory(
            categories[0]?._id || ""
        );

        setDescription("");

        setStatus("Draft");

        setFeatured(false);

        setYear(
            new Date()
                .getFullYear()
                .toString()
        );

        setFeaturedImage(null);

        setEditing(null);

        setSlugEdited(false);

        setFormError("");
    }

    /* =====================================================
       CREATE
    ===================================================== */

    function openCreate() {
        resetForm();

        setShowForm(true);
    }

    /* =====================================================
       EDIT
    ===================================================== */

    function openEdit(
        project: Project
    ) {
        setEditing(project);

        setTitle(project.title);

        setSlug(project.slug);

        setClient(
            project.clientName
        );

        setCategory(
            typeof project.category ===
                "string"
                ? project.category
                : project.category?._id ||
                ""
        );

        setDescription(
            project.shortDescription
        );

        setStatus(project.status);

        setFeatured(
            project.featured
        );

        setYear(
            project.year?.toString() ||
            "2026"
        );

        if (
            project.featuredImage &&
            typeof project.featuredImage !==
            "string"
        ) {
            setFeaturedImage(
                project.featuredImage
            );
        } else {
            setFeaturedImage(null);
        }

        setSlugEdited(true);

        setFormError("");

        setShowForm(true);
    }

    /* =====================================================
       CLOSE
    ===================================================== */

    function closeForm() {
        setShowForm(false);

        resetForm();
    }

    /* =====================================================
       TITLE -> SLUG
    ===================================================== */

    function handleTitleChange(
        value: string
    ) {
        setTitle(value);

        if (!slugEdited) {
            setSlug(
                slugify(value)
            );
        }
    }

    /* =====================================================
       MEDIA UPLOAD
    ===================================================== */

    async function uploadFeaturedImage(
        file: File
    ) {
        if (
            file.size >
            MAX_FILE_SIZE
        ) {
            setFormError(
                "Image must be smaller than 10 MB."
            );

            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setFormError(
                "Please select an image file."
            );

            return;
        }

        try {
            setUploadingMedia(true);
            setFormError("");

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            const response =
                await fetch(
                    "/api/media",
                    {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                    }
                );

            const result =
                (await response.json()) as ApiResponse<any>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Image upload failed."
                );
            }

            const uploaded =
                Array.isArray(
                    result.data
                )
                    ? result.data[0]
                    : result.data;

            if (!uploaded) {
                throw new Error(
                    "Upload succeeded but no media record was returned."
                );
            }

            setFeaturedImage(
                uploaded
            );
        } catch (err) {
            setFormError(
                err instanceof Error
                    ? err.message
                    : "Image upload failed."
            );
        } finally {
            setUploadingMedia(false);
        }
    }

    /* =====================================================
       MEDIA PICKER
    ===================================================== */

    function openMediaPicker() {
        setMediaSearch("");

        setShowMediaPicker(true);

        fetchMedia();
    }

    function selectMedia(
        item: Media
    ) {
        setFeaturedImage(item);

        setShowMediaPicker(false);
    }

    /* =====================================================
       CREATE / UPDATE PROJECT
    ===================================================== */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setFormError("");

        const cleanTitle =
            title.trim();

        const cleanSlug =
            slug.trim() ||
            slugify(cleanTitle);

        const cleanClient =
            client.trim();

        const cleanDescription =
            description.trim();

        if (
            !cleanTitle ||
            !cleanSlug ||
            !cleanClient ||
            !cleanDescription
        ) {
            setFormError(
                "Please complete all required fields."
            );

            return;
        }

        if (!category) {
            setFormError(
                "Please select a category."
            );

            return;
        }

        if (!featuredImage) {
            setFormError(
                "Please select a featured image."
            );

            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                title: cleanTitle,

                slug: cleanSlug,

                clientName:
                    cleanClient,

                category,

                shortDescription:
                    cleanDescription,

                featuredImage:
                    featuredImage._id,

                status,

                featured,

                year:
                    Number(year) ||
                    new Date().getFullYear(),
            };

            const response =
                await fetch(
                    editing
                        ? `/api/portfolio/${editing._id}`
                        : "/api/portfolio",
                    {
                        method: editing
                            ? "PATCH"
                            : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

            const result =
                (await response.json()) as ApiResponse<any>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Failed to ${editing
                        ? "update"
                        : "create"
                    } project.`
                );
            }

            closeForm();

            await fetchProjects();
        } catch (err) {
            setFormError(
                err instanceof Error
                    ? err.message
                    : "Failed to save project."
            );
        } finally {
            setSubmitting(false);
        }
    }

    /* =====================================================
       DELETE
    ===================================================== */

    async function deleteProject() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);

            const response =
                await fetch(
                    `/api/portfolio/${deleteTarget._id}`,
                    {
                        method: "DELETE",
                        credentials:
                            "include",
                    }
                );

            const result =
                (await response.json()) as ApiResponse<any>;

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to delete project."
                );
            }

            setDeleteTarget(null);

            await fetchProjects();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete project."
            );
        } finally {
            setDeleting(false);
        }
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Business
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Portfolio
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage the projects and
                        case studies displayed on
                        the ADM website.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <span>{error}</span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* =================================================
                STATS
            ================================================= */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Projects"
                    value={stats.total}
                />

                <StatCard
                    label="Published"
                    value={stats.published}
                    valueClass="text-emerald-600"
                />

                <StatCard
                    label="Drafts"
                    value={stats.drafts}
                    valueClass="text-amber-600"
                />

                <StatCard
                    label="Featured"
                    value={stats.featured}
                    valueClass="text-blue-600"
                />
            </section>

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-lg">
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
                            placeholder="Search projects..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            "All",
                            "Published",
                            "Draft",
                        ].map(
                            (filter) => (
                                <button
                                    key={
                                        filter
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            filter as
                                            | "All"
                                            | ProjectStatus
                                        )
                                    }
                                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${statusFilter ===
                                            filter
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {filter}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* =================================================
                PROJECT GRID
            ================================================= */}

            {loading ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <Loader2
                        className="animate-spin text-blue-600"
                        size={30}
                    />
                </div>
            ) : projects.length >
                0 ? (
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map(
                        (project) => {
                            const image =
                                typeof project.featuredImage ===
                                    "string"
                                    ? project.featuredImage
                                    : project.featuredImage?.url ||
                                    "";

                            return (
                                <article
                                    key={
                                        project._id
                                    }
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    {/* IMAGE */}

                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                        {image ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    typeof project.featuredImage ===
                                                        "object"
                                                        ? project
                                                            .featuredImage
                                                            ?.alt ||
                                                        project.title
                                                        : project.title
                                                }
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <ImageIcon
                                                    size={
                                                        40
                                                    }
                                                    className="text-slate-300"
                                                />
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-black backdrop-blur ${project.status ===
                                                        "Published"
                                                        ? "bg-emerald-50/95 text-emerald-700"
                                                        : "bg-amber-50/95 text-amber-700"
                                                    }`}
                                            >
                                                {
                                                    project.status
                                                }
                                            </span>

                                            {project.featured && (
                                                <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                                                    FEATURED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* BODY */}

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-blue-600">
                                                    {getCategoryName(
                                                        project.category
                                                    )}
                                                </p>

                                                <h2 className="mt-1 truncate text-lg font-black text-slate-900">
                                                    {
                                                        project.title
                                                    }
                                                </h2>
                                            </div>

                                            <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                                {
                                                    project.year
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                                            {
                                                project.shortDescription
                                            }
                                        </p>

                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <p className="truncate text-xs font-semibold text-slate-400">
                                                {
                                                    project.clientName
                                                }
                                            </p>

                                            <div className="flex gap-1">
                                                <a
                                                    href={`/portfolio/${project.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Preview"
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <ExternalLink
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </a>

                                                <button
                                                    title="Edit"
                                                    onClick={() =>
                                                        openEdit(
                                                            project
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Edit3
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    title="Delete"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            project
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
                                </article>
                            );
                        }
                    )}
                </section>
            ) : (
                <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                    <FolderKanban
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 font-black text-slate-900">
                        No projects found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Try changing your search
                        or create a new project.
                    </p>
                </section>
            )}

            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            {showForm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeForm();
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Portfolio
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Project"
                                        : "Create Project"}
                                </h2>
                            </div>

                            <button
                                onClick={
                                    closeForm
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="max-h-[calc(100vh-140px)] space-y-5 overflow-y-auto p-6"
                        >
                            {/* FORM ERROR */}

                            {formError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                    {
                                        formError
                                    }
                                </div>
                            )}

                            {/* TITLE / SLUG */}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Project Title">
                                    <input
                                        value={
                                            title
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleTitleChange(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="e.g. Enterprise AI Platform"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Slug">
                                    <input
                                        value={
                                            slug
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setSlug(
                                                slugify(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            );

                                            setSlugEdited(
                                                true
                                            );
                                        }}
                                        required
                                        placeholder="enterprise-ai-platform"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            {/* CLIENT / CATEGORY */}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Client">
                                    <input
                                        value={
                                            client
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setClient(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="Client or company"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Category">
                                    <select
                                        value={
                                            category
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCategory(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        disabled={
                                            categoriesLoading
                                        }
                                        className="input"
                                    >
                                        <option value="">
                                            {categoriesLoading
                                                ? "Loading categories..."
                                                : "Select category"}
                                        </option>

                                        {categories.map(
                                            (
                                                item
                                            ) => (
                                                <option
                                                    key={
                                                        item._id
                                                    }
                                                    value={
                                                        item._id
                                                    }
                                                >
                                                    {
                                                        item.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>
                            </div>

                            {/* FEATURED IMAGE */}

                            <Field label="Featured Media">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    {featuredImage ? (
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-200 sm:w-52">
                                                {featuredImage.type ===
                                                    "image" ? (
                                                    <img
                                                        src={
                                                            featuredImage.url
                                                        }
                                                        alt={
                                                            featuredImage.alt ||
                                                            featuredImage.originalName
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <FileText
                                                            size={
                                                                35
                                                            }
                                                            className="text-slate-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                                                <div>
                                                    <p className="truncate text-sm font-bold text-slate-800">
                                                        {
                                                            featuredImage.originalName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {
                                                            featuredImage.mimeType
                                                        }{" "}
                                                        ·{" "}
                                                        {formatFileSize(
                                                            featuredImage.size
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            openMediaPicker
                                                        }
                                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                                    >
                                                        Change
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFeaturedImage(
                                                                null
                                                            )
                                                        }
                                                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={
                                                    openMediaPicker
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <ImageIcon
                                                    size={
                                                        18
                                                    }
                                                />
                                                Choose from Media
                                            </button>

                                            <label className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                                                <Upload
                                                    size={
                                                        18
                                                    }
                                                />
                                                Upload New

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={
                                                        uploadingMedia
                                                    }
                                                    onChange={(
                                                        event
                                                    ) => {
                                                        const file =
                                                            event
                                                                .target
                                                                .files?.[0];

                                                        if (
                                                            file
                                                        ) {
                                                            uploadFeaturedImage(
                                                                file
                                                            );
                                                        }

                                                        event.target.value =
                                                            "";
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    )}

                                    {uploadingMedia && (
                                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-600">
                                            <Loader2
                                                size={
                                                    15
                                                }
                                                className="animate-spin"
                                            />
                                            Uploading image...
                                        </div>
                                    )}

                                    <p className="mt-3 text-xs text-slate-400">
                                        Maximum file size:
                                        10 MB. Supported:
                                        JPG, PNG, WebP,
                                        GIF and SVG.
                                    </p>
                                </div>
                            </Field>

                            {/* DESCRIPTION */}

                            <Field label="Short Description">
                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDescription(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    required
                                    placeholder="Describe the project..."
                                    className="input min-h-28 resize-none py-3"
                                />
                            </Field>

                            {/* STATUS / YEAR */}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Status">
                                    <select
                                        value={
                                            status
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatus(
                                                event
                                                    .target
                                                    .value as ProjectStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="Draft">
                                            Draft
                                        </option>

                                        <option value="Published">
                                            Published
                                        </option>
                                    </select>
                                </Field>

                                <Field label="Year">
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={
                                            year
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setYear(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                    />
                                </Field>
                            </div>

                            {/* FEATURED */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={
                                        featured
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFeatured(
                                            event
                                                .target
                                                .checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Featured project
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Highlight this
                                        project across
                                        ADM portfolio
                                        sections.
                                    </p>
                                </div>
                            </label>

                            {/* ACTIONS */}

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
                                        submitting ||
                                        uploadingMedia
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =================================================
                MEDIA PICKER
            ================================================= */}

            {showMediaPicker && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Media Library
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    Choose Featured Image
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowMediaPicker(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* SEARCH */}

                        <div className="border-b border-slate-100 p-4">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={
                                        mediaSearch
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setMediaSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search media..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>

                        {/* MEDIA */}

                        <div className="overflow-y-auto p-5">
                            {mediaLoading ? (
                                <div className="flex min-h-[300px] items-center justify-center">
                                    <Loader2
                                        size={
                                            30
                                        }
                                        className="animate-spin text-blue-600"
                                    />
                                </div>
                            ) : media.length >
                                0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {media.map(
                                        (
                                            item
                                        ) => (
                                            <button
                                                type="button"
                                                key={
                                                    item._id
                                                }
                                                onClick={() =>
                                                    selectMedia(
                                                        item
                                                    )
                                                }
                                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:border-blue-500 hover:shadow-lg"
                                            >
                                                <div className="aspect-square overflow-hidden bg-slate-100">
                                                    {item.type ===
                                                        "image" ? (
                                                        <img
                                                            src={
                                                                item.url
                                                            }
                                                            alt={
                                                                item.alt ||
                                                                item.originalName
                                                            }
                                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                        />
                                                    ) : item.type ===
                                                        "video" ? (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Video
                                                                size={
                                                                    35
                                                                }
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <FileText
                                                                size={
                                                                    35
                                                                }
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3">
                                                    <p className="truncate text-xs font-bold text-slate-800">
                                                        {
                                                            item.originalName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        {formatFileSize(
                                                            item.size
                                                        )}
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <ImageIcon
                                        size={
                                            40
                                        }
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-3 text-sm font-bold text-slate-700">
                                        No images found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Upload an image
                                        first or change
                                        your search.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2
                                size={21}
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete project?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This will remove{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.title
                                }
                            </strong>{" "}
                            from the portfolio.
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
                                    deleteProject
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

                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    label,
    value,
    valueClass = "text-slate-900",
}: {
    label: string;
    value: number;
    valueClass?: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p
                className={`mt-2 text-3xl font-black ${valueClass}`}
            >
                {value}
            </p>
        </div>
    );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>

            {children}
        </div>
    );
}