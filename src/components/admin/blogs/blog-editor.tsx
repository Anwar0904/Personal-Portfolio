"use client";

import {
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ArrowLeft,
    Check,
    ChevronDown,
    Eye,
    Image as ImageIcon,
    Loader2,
    Plus,
    Save,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BlogStatus =
    | "draft"
    | "published";

type BlogEditorProps = {
    blogId?: string;
};

type User = {
    _id: string;
    name: string;
    email?: string;
    avatar?: string | null;
    jobTitle?: string | null;
};

type Category = {
    _id: string;
    name: string;
    slug?: string;
};

type Tag = {
    _id: string;
    name: string;
    slug?: string;
    color?: string;
};

type Media = {
    _id: string;
    title?: string;
    url?: string;
    path?: string;
    alt?: string;
    mimeType?: string;
};

type BlogFaq = {
    question: string;
    answer: string;
};

type BlogForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;

    category: string;

    featuredImage: string;

    tags: string[];

    featured: boolean;

    status: BlogStatus;

    publishedAt: string;

    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        canonicalUrl: string;
        robots: string;
    };

    faqs: BlogFaq[];
};

type ApiResponse<T> = {
    data?: T;
    message?: string;
};

type BlogResponse = {
    _id: string;

    title: string;
    slug: string;

    excerpt?: string;

    content: string;

    category:
    | string
    | {
        _id: string;
        name?: string;
    };

    author?:
    | string
    | {
        _id: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
        jobTitle?: string;
    };

    featuredImage?:
    | string
    | {
        _id: string;
        url?: string;
        path?: string;
        title?: string;
        alt?: string;
    }
    | null;

    tags?: Array<
        | string
        | {
            _id: string;
            name?: string;
        }
    >;

    featured?: boolean;

    status: BlogStatus;

    publishedAt?: string | null;

    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        canonicalUrl?: string;
        robots?: string;
    };

    faqs?: BlogFaq[];

    views?: number;

    readingTime?: number;
};

const EMPTY_FORM: BlogForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",

    category: "",

    featuredImage: "",

    tags: [],

    featured: false,

    status: "draft",

    publishedAt: "",

    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalUrl: "",
        robots: "index,follow",
    },

    faqs: [],
};

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function today() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

function getMediaUrl(
    media?: Media | null
) {
    return (
        media?.url ??
        media?.path ??
        ""
    );
}

function getErrorMessage(
    error: unknown
) {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong.";
}

function getRenderableContent(content: string) {
    const trimmedContent = content.trim();
    const fencedContent = trimmedContent.match(
        /^```(?:html)?\s*([\s\S]*?)\s*```$/i
    );

    if (fencedContent) {
        return fencedContent[1];
    }

    if (
        /```/.test(trimmedContent) &&
        /<\s*(article|section|header|h[1-6]|p|ul|ol)\b/i.test(
            trimmedContent
        )
    ) {
        return trimmedContent
            .replace(/```(?:html)?\s*/gi, "")
            .replace(/```/g, "");
    }

    return content;
}

export default function BlogEditor({
    blogId,
}: BlogEditorProps) {
    const router = useRouter();

    const isEditing =
        Boolean(blogId);

    const [form, setForm] =
        useState<BlogForm>({
            ...EMPTY_FORM,
            publishedAt: today(),
        });

    const [currentUser, setCurrentUser] =
        useState<User | null>(null);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [tags, setTags] =
        useState<Tag[]>([]);

    const [media, setMedia] =
        useState<Media[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [preview, setPreview] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    const [categorySearch, setCategorySearch] =
        useState("");

    const [categoryOpen, setCategoryOpen] =
        useState(false);

    const [tagSearch, setTagSearch] =
        useState("");

    const [mediaSearch, setMediaSearch] =
        useState("");

    const [mediaOpen, setMediaOpen] =
        useState(false);

    const [newTagInput, setNewTagInput] =
        useState("");

    const [newFaq, setNewFaq] =
        useState<BlogFaq>({
            question: "",
            answer: "",
        });

    const [dirty, setDirty] =
        useState(false);

    /*
     * -----------------------------------------
     * Form helpers
     * -----------------------------------------
     */

    const updateForm = useCallback(
        <K extends keyof BlogForm>(
            key: K,
            value: BlogForm[K]
        ) => {
            setForm((current) => ({
                ...current,
                [key]: value,
            }));

            setDirty(true);
            setSuccess(null);
        },
        []
    );

    const updateSeo = useCallback(
        (
            key: keyof BlogForm["seo"],
            value:
                | string
                | string[]
        ) => {
            setForm((current) => ({
                ...current,

                seo: {
                    ...current.seo,
                    [key]: value,
                },
            }));

            setDirty(true);
        },
        []
    );

    /*
     * -----------------------------------------
     * Load current user
     * -----------------------------------------
     */

    const loadCurrentUser =
        useCallback(async () => {
            const response =
                await fetch(
                    "/api/auth/me",
                    {
                        cache: "no-store",
                    }
                );

            const body =
                (await response.json()) as ApiResponse<User>;

            if (!response.ok) {
                throw new Error(
                    body.message ??
                    "Unable to load current user."
                );
            }

            if (!body.data) {
                throw new Error(
                    "Current user was not returned."
                );
            }

            setCurrentUser(
                body.data
            );
        }, []);

    /*
     * -----------------------------------------
     * Load lookup data
     * -----------------------------------------
     *
     * Expected:
     * /api/admin/blog-lookups
     *
     * {
     *   data: {
     *      categories,
     *      tags,
     *      media
     *   }
     * }
     */

    const loadLookups =
        useCallback(async () => {
            const response =
                await fetch(
                    "/api/admin/blog-lookups",
                    {
                        cache: "no-store",
                    }
                );

            const body =
                (await response.json()) as ApiResponse<{
                    categories?: Category[];
                    tags?: Tag[];
                    media?: Media[];
                }>;

            if (!response.ok) {
                throw new Error(
                    body.message ??
                    "Unable to load blog options."
                );
            }

            setCategories(
                body.data?.categories ??
                []
            );

            setTags(
                body.data?.tags ??
                []
            );

            setMedia(
                body.data?.media ??
                []
            );
        }, []);

    /*
     * -----------------------------------------
     * Load blog for edit
     * -----------------------------------------
     */

    const loadBlog =
        useCallback(async () => {
            if (!blogId) return;

            const response =
                await fetch(
                    `/api/blogs/${blogId}`,
                    {
                        cache: "no-store",
                    }
                );

            const body =
                (await response.json()) as ApiResponse<BlogResponse>;

            if (!response.ok) {
                throw new Error(
                    body.message ??
                    "Unable to load blog."
                );
            }

            if (!body.data) {
                throw new Error(
                    "Blog data was not returned."
                );
            }

            const blog =
                body.data;

            const categoryId =
                typeof blog.category ===
                    "string"
                    ? blog.category
                    : blog.category._id;

            const selectedTags =
                (blog.tags ?? []).map(
                    (tag) =>
                        typeof tag ===
                            "string"
                            ? tag
                            : tag._id
                );

            const featuredImage =
                typeof blog.featuredImage ===
                    "string"
                    ? blog.featuredImage
                    : blog.featuredImage?._id ??
                    "";

            setForm({
                title:
                    blog.title ?? "",

                slug:
                    blog.slug ?? "",

                excerpt:
                    blog.excerpt ?? "",

                content:
                    blog.content ?? "",

                category:
                    categoryId,

                featuredImage,

                tags: selectedTags,

                featured:
                    blog.featured ??
                    false,

                status:
                    blog.status ??
                    "draft",

                publishedAt:
                    blog.publishedAt
                        ? blog.publishedAt.slice(
                            0,
                            10
                        )
                        : "",

                seo: {
                    metaTitle:
                        blog.seo
                            ?.metaTitle ??
                        blog.title ??
                        "",

                    metaDescription:
                        blog.seo
                            ?.metaDescription ??
                        blog.excerpt ??
                        "",

                    keywords:
                        blog.seo
                            ?.keywords ??
                        [],

                    canonicalUrl:
                        blog.seo
                            ?.canonicalUrl ??
                        "",

                    robots:
                        blog.seo?.robots ??
                        "index,follow",
                },

                faqs:
                    blog.faqs ??
                    [],
            });

            /*
             * Author is read-only.
             * We don't put it into the payload.
             */
            if (
                blog.author &&
                typeof blog.author !==
                "string"
            ) {
                const authorName =
                    blog.author.name ??
                    [
                        blog.author.firstName,
                        blog.author.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ");

                setCurrentUser({
                    _id:
                        blog.author._id,

                    name:
                        authorName ||
                        "Unknown author",

                    email:
                        blog.author.email,

                    avatar:
                        blog.author.avatar ??
                        null,

                    jobTitle:
                        blog.author.jobTitle ??
                        null,
                });
            }
        }, [blogId]);

    /*
     * -----------------------------------------
     * Initial loading
     * -----------------------------------------
     */

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                setLoading(true);
                setError(null);

                await Promise.all([
                    loadCurrentUser(),
                    loadLookups(),
                    loadBlog(),
                ]);
            } catch (reason) {
                if (!cancelled) {
                    setError(
                        getErrorMessage(
                            reason
                        )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setDirty(false);
                }
            }
        }

        initialize();

        return () => {
            cancelled = true;
        };
    }, [
        loadCurrentUser,
        loadLookups,
        loadBlog,
    ]);

    /*
     * -----------------------------------------
     * Auto slug
     * -----------------------------------------
     */

    const generatedSlug =
        useMemo(
            () =>
                slugify(
                    form.title
                ),
            [form.title]
        );

    function generateSlug() {
        updateForm(
            "slug",
            generatedSlug
        );
    }

    /*
     * -----------------------------------------
     * Reading time
     * -----------------------------------------
     */

    const readingTime =
        useMemo(() => {
            const words =
                form.content
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .length;

            if (!words) return 0;

            return Math.max(
                1,
                Math.ceil(
                    words / 200
                )
            );
        }, [form.content]);

    /*
     * -----------------------------------------
     * Filtered lookups
     * -----------------------------------------
     */

    const filteredCategories =
        useMemo(() => {
            const search =
                categorySearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return categories;
            }

            return categories.filter(
                (category) =>
                    category.name
                        .toLowerCase()
                        .includes(search)
            );
        }, [
            categories,
            categorySearch,
        ]);

    const filteredTags =
        useMemo(() => {
            const search =
                tagSearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return tags;
            }

            return tags.filter(
                (tag) =>
                    tag.name
                        .toLowerCase()
                        .includes(search)
            );
        }, [
            tags,
            tagSearch,
        ]);

    const filteredMedia =
        useMemo(() => {
            const search =
                mediaSearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return media;
            }

            return media.filter(
                (item) =>
                    item.title
                        ?.toLowerCase()
                        .includes(search) ||
                    item.alt
                        ?.toLowerCase()
                        .includes(search)
            );
        }, [
            media,
            mediaSearch,
        ]);

    const selectedCategory =
        categories.find(
            (item) =>
                item._id ===
                form.category
        );

    const selectedMedia =
        media.find(
            (item) =>
                item._id ===
                form.featuredImage
        );

    /*
     * -----------------------------------------
     * Tags
     * -----------------------------------------
     */

    function addTag(
        tagId: string
    ) {
        if (
            form.tags.includes(
                tagId
            )
        ) {
            return;
        }

        updateForm(
            "tags",
            [
                ...form.tags,
                tagId,
            ]
        );

        setTagSearch("");
    }

    function removeTag(
        tagId: string
    ) {
        updateForm(
            "tags",
            form.tags.filter(
                (id) =>
                    id !== tagId
            )
        );
    }

    function addNewTag() {
        const value =
            newTagInput
                .trim()
                .toLowerCase();

        if (!value) return;

        const existing =
            tags.find(
                (tag) =>
                    tag.name
                        .toLowerCase() ===
                    value
            );

        if (existing) {
            addTag(
                existing._id
            );

            setNewTagInput("");
            return;
        }

        /*
         * The editor does not silently
         * create tags. This prevents
         * accidental duplicate tags.
         */
        setError(
            "Create the tag from Tag Management first, then select it here."
        );
    }

    /*
     * -----------------------------------------
     * FAQ
     * -----------------------------------------
     */

    function addFaq() {
        const question =
            newFaq.question.trim();

        const answer =
            newFaq.answer.trim();

        if (!question || !answer) {
            setError(
                "FAQ question and answer are required."
            );

            return;
        }

        updateForm(
            "faqs",
            [
                ...form.faqs,
                {
                    question,
                    answer,
                },
            ]
        );

        setNewFaq({
            question: "",
            answer: "",
        });
    }

    function removeFaq(
        index: number
    ) {
        updateForm(
            "faqs",
            form.faqs.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    }

    function updateFaq(
        index: number,
        key: keyof BlogFaq,
        value: string
    ) {
        updateForm(
            "faqs",
            form.faqs.map(
                (faq, itemIndex) =>
                    itemIndex === index
                        ? {
                            ...faq,
                            [key]:
                                value,
                        }
                        : faq
            )
        );
    }

    /*
     * -----------------------------------------
     * Validation
     * -----------------------------------------
     */

    function validate() {
        if (
            form.title.trim()
                .length < 5
        ) {
            return "Blog title must contain at least 5 characters.";
        }

        if (
            form.slug.trim()
                .length < 3
        ) {
            return "Blog slug is required.";
        }

        if (
            form.excerpt.trim()
                .length < 10
        ) {
            return "Excerpt must contain at least 10 characters.";
        }

        if (
            form.content.trim()
                .length < 20
        ) {
            return "Blog content must contain at least 20 characters.";
        }

        if (!form.category) {
            return "Please select a category.";
        }

        if (
            form.status ===
            "published" &&
            !form.publishedAt
        ) {
            return "Published blogs require a publication date.";
        }

        if (
            form.seo.metaTitle.trim()
                .length === 0
        ) {
            return "SEO meta title is required.";
        }

        if (
            form.seo.metaDescription.trim()
                .length === 0
        ) {
            return "SEO meta description is required.";
        }

        return null;
    }

    /*
     * -----------------------------------------
     * Save
     * -----------------------------------------
     */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        const validation =
            validate();

        if (validation) {
            setError(validation);
            return;
        }

        setSaving(true);

        try {
            const payload = {
                title:
                    form.title.trim(),

                slug:
                    form.slug.trim(),

                excerpt:
                    form.excerpt.trim(),

                content:
                    form.content.trim(),

                category:
                    form.category,

                featuredImage:
                    form.featuredImage ||
                    null,

                gallery: [],

                tags:
                    form.tags,

                featured:
                    form.featured,

                status:
                    form.status,

                publishedAt:
                    form.status ===
                        "published" &&
                        form.publishedAt
                        ? new Date(
                            `${form.publishedAt}T00:00:00.000Z`
                        ).toISOString()
                        : null,

                seo: {
                    metaTitle:
                        form.seo.metaTitle.trim(),

                    metaDescription:
                        form.seo.metaDescription.trim(),

                    keywords:
                        form.seo.keywords,

                    canonicalUrl:
                        form.seo.canonicalUrl.trim() ||
                        undefined,

                    robots:
                        form.seo.robots,
                },

                faqs:
                    form.faqs,
            };

            const response =
                await fetch(
                    isEditing
                        ? `/api/blogs/${blogId}`
                        : "/api/blogs",
                    {
                        method: isEditing
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
                (await response.json()) as ApiResponse<BlogResponse>;

            if (!response.ok) {
                throw new Error(
                    body.message ??
                    "Unable to save blog."
                );
            }

            setDirty(false);

            setSuccess(
                isEditing
                    ? "Blog updated successfully."
                    : "Blog created successfully."
            );

            router.push(
                "/admin/blogs"
            );

            router.refresh();
        } catch (reason) {
            setError(
                getErrorMessage(
                    reason
                )
            );
        } finally {
            setSaving(false);
        }
    }

    /*
     * -----------------------------------------
     * Unsaved changes warning
     * -----------------------------------------
     */

    useEffect(() => {
        function handleBeforeUnload(
            event: BeforeUnloadEvent
        ) {
            if (!dirty || saving) {
                return;
            }

            event.preventDefault();
            event.returnValue = "";
        }

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {
            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );
        };
    }, [
        dirty,
        saving,
    ]);

    /*
     * -----------------------------------------
     * Loading
     * -----------------------------------------
     */

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <div className="text-center">
                        <Loader2
                            className="mx-auto animate-spin text-blue-600"
                            size={30}
                        />

                        <p className="mt-3 text-sm font-bold text-slate-500">
                            Loading blog editor...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * -----------------------------------------
     * Preview
     * -----------------------------------------
     */

    if (preview) {
        return (
            <Preview
                form={form}
                readingTime={
                    readingTime
                }
                category={
                    selectedCategory
                        ?.name ??
                    "Uncategorized"
                }
                author={
                    currentUser
                }
                media={
                    selectedMedia
                }
                onClose={() =>
                    setPreview(false)
                }
            />
        );
    }

    /*
     * -----------------------------------------
     * UI
     * -----------------------------------------
     */

    return (
        <div className="mx-auto max-w-7xl pb-16">
            {/* Header */}

            <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <Link
                        href="/admin/blogs"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    >
                        <ArrowLeft
                            size={18}
                        />
                    </Link>

                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                            Content Management
                        </p>

                        <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            {isEditing
                                ? "Edit Blog"
                                : "Create Blog"}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={() =>
                            setPreview(true)
                        }
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <Eye
                            size={17}
                        />
                        Preview
                    </button>

                    <button
                        form="blog-editor-form"
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <Save
                                size={17}
                            />
                        )}

                        {saving
                            ? "Saving..."
                            : "Save Blog"}
                    </button>
                </div>
            </header>

            {/* Messages */}

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <X
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError(null)
                        }
                        className="ml-auto"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    <Check
                        size={18}
                    />

                    {success}
                </div>
            )}

            <form
                id="blog-editor-form"
                onSubmit={
                    handleSubmit
                }
                className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
            >
                {/* ================= MAIN ================= */}

                <main className="min-w-0 space-y-6">
                    {/* Basic */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeading
                            title="Blog Content"
                            description="Write and structure your article."
                        />

                        <div className="mt-6 space-y-5">
                            <Field label="Title">
                                <input
                                    value={
                                        form.title
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            "title",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Enter a compelling blog title"
                                    maxLength={
                                        200
                                    }
                                    required
                                    className="input text-lg font-bold"
                                />

                                <CharCount
                                    value={
                                        form.title
                                    }
                                    max={
                                        200
                                    }
                                />
                            </Field>

                            <Field label="Slug">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        value={
                                            form.slug
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "slug",
                                                event
                                                    .target
                                                    .value
                                                    .toLowerCase()
                                            )
                                        }
                                        placeholder="blog-url-slug"
                                        className="input flex-1 font-mono text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            generateSlug
                                        }
                                        className="h-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-600 hover:bg-slate-100"
                                    >
                                        Generate
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    /blogs/
                                    {form.slug ||
                                        "your-blog-slug"}
                                </p>
                            </Field>

                            <Field label="Excerpt">
                                <textarea
                                    value={
                                        form.excerpt
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            "excerpt",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    maxLength={
                                        500
                                    }
                                    placeholder="Short description used on blog cards, SEO previews and social sharing."
                                    className="input resize-none leading-6"
                                />

                                <CharCount
                                    value={
                                        form.excerpt
                                    }
                                    max={
                                        500
                                    }
                                />
                            </Field>

                            <Field
                                label="Content"
                                hint={`${readingTime || 0} min estimated reading time`}
                            >
                                <textarea
                                    value={
                                        form.content
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            "content",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={
                                        24
                                    }
                                    required
                                    placeholder="Write your article content here..."
                                    className="input min-h-[480px] resize-y font-mono text-sm leading-7"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* SEO */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeading
                            title="SEO"
                            description="Optimize how this article appears in search engines."
                        />

                        <div className="mt-6 space-y-5">
                            <Field label="Meta Title">
                                <input
                                    value={
                                        form.seo
                                            .metaTitle
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateSeo(
                                            "metaTitle",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    maxLength={
                                        200
                                    }
                                    className="input"
                                />

                                <CharCount
                                    value={
                                        form.seo
                                            .metaTitle
                                    }
                                    max={
                                        200
                                    }
                                />
                            </Field>

                            <Field label="Meta Description">
                                <textarea
                                    value={
                                        form.seo
                                            .metaDescription
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateSeo(
                                            "metaDescription",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    maxLength={
                                        500
                                    }
                                    className="input resize-none"
                                />

                                <CharCount
                                    value={
                                        form.seo
                                            .metaDescription
                                    }
                                    max={
                                        500
                                    }
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
                                        updateSeo(
                                            "canonicalUrl",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="https://globalsmmportal.com/blogs/example"
                                    className="input"
                                />
                            </Field>

                            <Field label="Robots">
                                <select
                                    value={
                                        form.seo
                                            .robots
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateSeo(
                                            "robots",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="input"
                                >
                                    <option value="index,follow">
                                        index, follow
                                    </option>

                                    <option value="noindex,nofollow">
                                        noindex, nofollow
                                    </option>

                                    <option value="index,nofollow">
                                        index, nofollow
                                    </option>

                                    <option value="noindex,follow">
                                        noindex, follow
                                    </option>
                                </select>
                            </Field>

                            <Field label="Keywords">
                                <input
                                    value={form.seo.keywords.join(
                                        ", "
                                    )}
                                    onChange={(
                                        event
                                    ) =>
                                        updateSeo(
                                            "keywords",
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
                                                )
                                        )
                                    }
                                    placeholder="AI, enterprise software, digital transformation"
                                    className="input"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* FAQs */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeading
                            title="Article FAQs"
                            description="Optional questions that can be displayed with the article."
                        />

                        {form.faqs.length >
                            0 && (
                                <div className="mt-6 space-y-3">
                                    {form.faqs.map(
                                        (
                                            faq,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-3">
                                                        <input
                                                            value={
                                                                faq.question
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateFaq(
                                                                    index,
                                                                    "question",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Question"
                                                            className="input bg-white"
                                                        />

                                                        <textarea
                                                            value={
                                                                faq.answer
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateFaq(
                                                                    index,
                                                                    "answer",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Answer"
                                                            rows={
                                                                3
                                                            }
                                                            className="input resize-none bg-white"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeFaq(
                                                                index
                                                            )
                                                        }
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4">
                            <div className="grid gap-3">
                                <input
                                    value={
                                        newFaq.question
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewFaq(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                question:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="New FAQ question"
                                    className="input"
                                />

                                <textarea
                                    value={
                                        newFaq.answer
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewFaq(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                answer:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="FAQ answer"
                                    rows={
                                        3
                                    }
                                    className="input resize-none"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        addFaq
                                    }
                                    className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
                                >
                                    <Plus
                                        size={
                                            15
                                        }
                                    />
                                    Add FAQ
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* ================= SIDEBAR ================= */}

                <aside className="min-w-0 space-y-6">
                    {/* Publishing */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionHeading
                            title="Publishing"
                            description="Control visibility and publication."
                        />

                        <div className="mt-5 space-y-4">
                            <Field label="Status">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateForm(
                                                "status",
                                                "draft"
                                            )
                                        }
                                        className={`h-11 rounded-xl border text-sm font-bold ${form.status ===
                                            "draft"
                                            ? "border-amber-300 bg-amber-50 text-amber-700"
                                            : "border-slate-200 bg-white text-slate-500"
                                            }`}
                                    >
                                        Draft
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateForm(
                                                "status",
                                                "published"
                                            )
                                        }
                                        className={`h-11 rounded-xl border text-sm font-bold ${form.status ===
                                            "published"
                                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 bg-white text-slate-500"
                                            }`}
                                    >
                                        Published
                                    </button>
                                </div>
                            </Field>

                            <Field label="Publication Date">
                                <input
                                    type="date"
                                    value={
                                        form.publishedAt
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            "publishedAt",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        form.status !==
                                        "published"
                                    }
                                    className="input disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                            </Field>

                            <Toggle
                                label="Featured Article"
                                description="Highlight this article across ADM."
                                checked={
                                    form.featured
                                }
                                onChange={(
                                    value
                                ) =>
                                    updateForm(
                                        "featured",
                                        value
                                    )
                                }
                                icon={
                                    <Star
                                        size={
                                            16
                                        }
                                    />
                                }
                            />
                        </div>
                    </section>

                    {/* Author */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionHeading
                            title="Author"
                            description="Automatically assigned from the authenticated account."
                        />

                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <Avatar
                                user={
                                    currentUser
                                }
                            />

                            <div className="min-w-0">
                                <p className="truncate text-sm font-black text-slate-800">
                                    {currentUser?.name ??
                                        "Current user"}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {currentUser?.email ??
                                        ""}
                                </p>

                                {currentUser?.jobTitle && (
                                    <p className="truncate text-[11px] font-bold text-blue-600">
                                        {
                                            currentUser.jobTitle
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Category */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionHeading
                            title="Category"
                            description="Choose the primary blog category."
                        />

                        <div className="relative mt-5">
                            <button
                                type="button"
                                onClick={() =>
                                    setCategoryOpen(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm font-bold text-slate-700"
                            >
                                <span className="truncate">
                                    {selectedCategory
                                        ?.name ??
                                        "Select category"}
                                </span>

                                <ChevronDown
                                    size={
                                        16
                                    }
                                />
                            </button>

                            {categoryOpen && (
                                <Dropdown>
                                    <div className="border-b border-slate-100 p-2">
                                        <div className="relative">
                                            <Search
                                                size={
                                                    15
                                                }
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                autoFocus
                                                value={
                                                    categorySearch
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setCategorySearch(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Search category..."
                                                className="h-9 w-full rounded-lg bg-slate-50 pl-9 pr-3 text-xs outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="max-h-56 overflow-y-auto p-1">
                                        {filteredCategories.map(
                                            (
                                                item
                                            ) => (
                                                <button
                                                    key={
                                                        item._id
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        updateForm(
                                                            "category",
                                                            item._id
                                                        );

                                                        setCategoryOpen(
                                                            false
                                                        );

                                                        setCategorySearch(
                                                            ""
                                                        );
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-bold hover:bg-slate-50 ${form.category ===
                                                        item._id
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-slate-600"
                                                        }`}
                                                >
                                                    {
                                                        item.name
                                                    }

                                                    {form.category ===
                                                        item._id && (
                                                            <Check
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        )}
                                                </button>
                                            )
                                        )}

                                        {filteredCategories.length ===
                                            0 && (
                                                <p className="p-4 text-center text-xs text-slate-400">
                                                    No categories found.
                                                </p>
                                            )}
                                    </div>
                                </Dropdown>
                            )}
                        </div>
                    </section>

                    {/* Tags */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionHeading
                            title="Tags"
                            description="Select existing tags."
                        />

                        {form.tags.length >
                            0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {form.tags.map(
                                        (
                                            tagId
                                        ) => {
                                            const tag =
                                                tags.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item._id ===
                                                        tagId
                                                );

                                            return (
                                                <span
                                                    key={
                                                        tagId
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                                                >
                                                    #
                                                    {tag?.name ??
                                                        tagId}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(
                                                                tagId
                                                            )
                                                        }
                                                        className="ml-1 rounded-full hover:bg-blue-100"
                                                    >
                                                        <X
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </span>
                                            );
                                        }
                                    )}
                                </div>
                            )}

                        <div className="mt-4">
                            <div className="relative">
                                <Search
                                    size={
                                        15
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={
                                        tagSearch
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTagSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search tags..."
                                    className="input pl-9"
                                />
                            </div>

                            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200">
                                {filteredTags.map(
                                    (
                                        tag
                                    ) => {
                                        const selected =
                                            form.tags.includes(
                                                tag._id
                                            );

                                        return (
                                            <button
                                                key={
                                                    tag._id
                                                }
                                                type="button"
                                                disabled={
                                                    selected
                                                }
                                                onClick={() =>
                                                    addTag(
                                                        tag._id
                                                    )
                                                }
                                                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-bold ${selected
                                                    ? "bg-blue-50 text-blue-400"
                                                    : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {
                                                    tag.name
                                                }

                                                {selected && (
                                                    <Check
                                                        size={
                                                            14
                                                        }
                                                    />
                                                )}
                                            </button>
                                        );
                                    }
                                )}

                                {filteredTags.length ===
                                    0 && (
                                        <p className="p-4 text-center text-xs text-slate-400">
                                            No tags found.
                                        </p>
                                    )}
                            </div>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <p className="mb-2 text-[11px] font-bold text-slate-400">
                                Need a new tag?
                            </p>

                            <div className="flex gap-2">
                                <input
                                    value={
                                        newTagInput
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewTagInput(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Tag name"
                                    className="input min-w-0 flex-1"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        addNewTag
                                    }
                                    className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                >
                                    <Plus
                                        size={
                                            17
                                        }
                                        className="mx-auto"
                                    />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Media */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <SectionHeading
                            title="Cover Image"
                            description="Select media from your ADM media library."
                        />

                        <div className="mt-5">
                            {selectedMedia ? (
                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <div className="aspect-video bg-slate-100">
                                        {getMediaUrl(
                                            selectedMedia
                                        ) && (
                                                <img
                                                    src={getMediaUrl(
                                                        selectedMedia
                                                    )}
                                                    alt={
                                                        selectedMedia.alt ??
                                                        selectedMedia.title ??
                                                        ""
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3 p-3">
                                        <p className="truncate text-xs font-bold text-slate-700">
                                            {selectedMedia.title ??
                                                "Selected image"}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateForm(
                                                    "featuredImage",
                                                    ""
                                                )
                                            }
                                            className="shrink-0 text-xs font-bold text-red-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                                    <div className="text-center">
                                        <ImageIcon
                                            size={
                                                28
                                            }
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-2 text-xs font-bold text-slate-400">
                                            No cover image
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    setMediaOpen(
                                        true
                                    )
                                }
                                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:bg-slate-50"
                            >
                                <ImageIcon
                                    size={
                                        16
                                    }
                                />
                                Select from Media
                            </button>
                        </div>
                    </section>
                </aside>
            </form>

            {/* Media modal */}

            {mediaOpen && (
                <MediaPicker
                    media={
                        filteredMedia
                    }
                    search={
                        mediaSearch
                    }
                    onSearch={
                        setMediaSearch
                    }
                    selectedId={
                        form.featuredImage
                    }
                    onSelect={(
                        mediaId
                    ) => {
                        updateForm(
                            "featuredImage",
                            mediaId
                        );

                        setMediaOpen(
                            false
                        );

                        setMediaSearch(
                            ""
                        );
                    }}
                    onClose={() =>
                        setMediaOpen(
                            false
                        )
                    }
                />
            )}
        </div>
    );
}

/*
 * =====================================================
 * Components
 * =====================================================
 */

function SectionHeading({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div>
            <h2 className="text-base font-black text-slate-900">
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-xs font-black text-slate-700">
                    {label}
                </label>

                {hint && (
                    <span className="text-[10px] font-bold text-slate-400">
                        {hint}
                    </span>
                )}
            </div>

            {children}
        </div>
    );
}

function CharCount({
    value,
    max,
}: {
    value: string;
    max: number;
}) {
    return (
        <p
            className={`mt-1 text-right text-[10px] font-semibold ${value.length > max
                ? "text-red-500"
                : "text-slate-400"
                }`}
        >
            {value.length}/{max}
        </p>
    );
}

function Avatar({
    user,
}: {
    user: User | null;
}) {
    if (user?.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
            {user?.name
                ?.charAt(0)
                .toUpperCase() ??
                "U"}
        </div>
    );
}

function Toggle({
    label,
    description,
    checked,
    onChange,
    icon,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (
        value: boolean
    ) => void;
    icon?: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={() =>
                onChange(!checked)
            }
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50"
        >
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400"
                    }`}
            >
                {icon}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-xs font-black text-slate-800">
                    {label}
                </span>

                <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">
                    {description}
                </span>
            </span>

            <span
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked
                    ? "bg-blue-600"
                    : "bg-slate-300"
                    }`}
            >
                <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked
                        ? "left-[18px]"
                        : "left-0.5"
                        }`}
                />
            </span>
        </button>
    );
}

function Dropdown({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            {children}
        </div>
    );
}

function MediaPicker({
    media,
    search,
    onSearch,
    selectedId,
    onSelect,
    onClose,
}: {
    media: Media[];
    search: string;
    onSearch: (
        value: string
    ) => void;
    selectedId: string;
    onSelect: (
        id: string
    ) => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5">
                    <div>
                        <h3 className="text-base font-black text-slate-900">
                            Select Cover Image
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Choose an image from your media library.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X
                            size={18}
                        />
                    </button>
                </div>

                <div className="border-b border-slate-100 p-4">
                    <div className="relative">
                        <Search
                            size={
                                16
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            autoFocus
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                onSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search media..."
                            className="input pl-9"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                    {media.length ===
                        0 ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-center">
                                <ImageIcon
                                    size={
                                        32
                                    }
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm font-bold text-slate-500">
                                    No media found.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {media.map(
                                (
                                    item
                                ) => {
                                    const url =
                                        getMediaUrl(
                                            item
                                        );

                                    const selected =
                                        item._id ===
                                        selectedId;

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                item._id
                                            }
                                            onClick={() =>
                                                onSelect(
                                                    item._id
                                                )
                                            }
                                            className={`group overflow-hidden rounded-xl border text-left transition ${selected
                                                ? "border-blue-500 ring-2 ring-blue-500/20"
                                                : "border-slate-200 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="relative aspect-video bg-slate-100">
                                                {url && (
                                                    <img
                                                        src={
                                                            url
                                                        }
                                                        alt={
                                                            item.alt ??
                                                            item.title ??
                                                            ""
                                                        }
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                )}

                                                {selected && (
                                                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                                        <Check
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2.5">
                                                <p className="truncate text-[11px] font-bold text-slate-700">
                                                    {item.title ??
                                                        "Untitled media"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Preview({
    form,
    readingTime,
    category,
    author,
    media,
    onClose,
}: {
    form: BlogForm;
    readingTime: number;
    category: string;
    author: User | null;
    media?: Media;
    onClose: () => void;
}) {
    const image =
        getMediaUrl(
            media
        );

    return (
        <div className="mx-auto max-w-5xl pb-16">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                        Preview
                    </p>

                    <h1 className="mt-1 text-2xl font-black text-slate-900">
                        Article Preview
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600"
                >
                    <ArrowLeft
                        size={16}
                    />
                    Back to editor
                </button>
            </div>

            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {image && (
                    <div className="aspect-[21/9] bg-slate-100">
                        <img
                            src={image}
                            alt={
                                form.title
                            }
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6 sm:p-10 lg:p-14">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                            {category}
                        </span>

                        <span className="text-slate-400">
                            {readingTime} min read
                        </span>
                    </div>

                    <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                        {form.title ||
                            "Untitled Blog"}
                    </h1>

                    {form.excerpt && (
                        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
                            {
                                form.excerpt
                            }
                        </p>
                    )}

                    <div className="mt-6 flex items-center gap-3 border-b border-slate-100 pb-6">
                        <Avatar
                            user={
                                author
                            }
                        />

                        <div>
                            <p className="text-sm font-black text-slate-800">
                                {author?.name ??
                                    "ADM Team"}
                            </p>

                            <p className="text-xs text-slate-400">
                                {form.publishedAt ||
                                    "Draft"}
                            </p>
                        </div>
                    </div>

                    <div
                        className="prose bg-black prose-slate mt-8 max-w-none text-sm leading-8 sm:text-base [&_a]:font-bold [&_a]:text-blue-600 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-black [&_ul]:mb-4"
                        dangerouslySetInnerHTML={{
                            __html:
                                getRenderableContent(
                                    form.content
                                ) ||
                                "<p>Start writing your article...</p>",
                        }}
                    />

                    {form.faqs.length >
                        0 && (
                            <section className="mt-12 border-t border-slate-100 pt-8">
                                <h2 className="text-2xl font-black text-slate-900">
                                    Frequently Asked Questions
                                </h2>

                                <div className="mt-5 space-y-4">
                                    {form.faqs.map(
                                        (
                                            faq,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="rounded-xl border border-slate-200 p-5"
                                            >
                                                <h3 className="font-black text-slate-900">
                                                    {
                                                        faq.question
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                    {
                                                        faq.answer
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}
                </div>
            </article>
        </div>
    );
}