"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Edit3,
    Eye,

    MoreHorizontal,
    Plus,
    Search,
    Star,
    Trash2,
    // TrendingUp,
} from "lucide-react";

type BlogStatus = "Published" | "Draft";

type Blog = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    coverImage: string;
    status: BlogStatus;
    featured: boolean;
    // trending: boolean;
    views: number;
    readingTime: number;
    publishedAt: string;
};

const initialBlogs: Blog[] = [
    {
        id: "1",
        title: "Building Enterprise AI Applications in 2026",
        slug: "building-enterprise-ai-applications",
        excerpt:
            "Discover the architecture, tools and best practices behind scalable enterprise AI systems.",
        category: "Artificial Intelligence",
        author: "Sarah Johnson",
        coverImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
        status: "Published",
        featured: true,
        // trending: false,
        views: 8250,
        readingTime: 8,
        publishedAt: "2026-07-25",
    },
    {
        id: "2",
        title: "Next.js 16 Best Practices Every Developer Should Know",
        slug: "nextjs-best-practices",
        excerpt:
            "Performance optimization, routing strategy and production deployment tips.",
        category: "Next.js",
        author: "Michael Chen",
        coverImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80",
        status: "Published",
        featured: false,
        // trending: true,
        views: 6400,
        readingTime: 6,
        publishedAt: "2026-07-20",
    },
    {
        id: "3",
        title: "Modern UI Design Principles That Increase Conversion",
        slug: "modern-ui-design-principles",
        excerpt:
            "Learn how premium interfaces improve usability and business growth.",
        category: "UI / UX",
        author: "Emma Wilson",
        coverImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
        status: "Published",
        featured: false,
        // trending: false,
        views: 4100,
        readingTime: 7,
        publishedAt: "2026-07-15",
    },
    {
        id: "4",
        title: "Cloud Native Development: The Future of Scalable Software",
        slug: "future-of-cloud-native-development",
        excerpt:
            "Containers, Kubernetes and cloud infrastructure explained in a practical way.",
        category: "Cloud",
        author: "David Miller",
        coverImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80",
        status: "Draft",
        featured: false,
        // trending: false,
        views: 0,
        readingTime: 9,
        publishedAt: "2026-07-10",
    },
];

export default function BlogsManagement() {
    const router = useRouter();

    const [blogs, setBlogs] =
        useState<Blog[]>([]);

    const [loading, setLoading] = useState(true);

    async function loadBlogs() {
        try {
            const response = await fetch("/api/blogs?limit=100", { cache: "no-store" });
            if (!response.ok) throw new Error("Unable to load blogs.");

            const body = await response.json() as {
                data?: {
                    blogs?: Array<{
                        _id: string;
                        title: string;
                        slug: string;
                        excerpt?: string;
                        category?: { name?: string };
                        author?: { name?: string };
                        featuredImage?: { url?: string; path?: string } | null;
                        status: "published" | "draft";
                        featured: boolean;
                        views: number;
                        readingTime: number;
                        publishedAt?: string | null;
                    }>
                };
            };

            setBlogs((body.data?.blogs ?? []).map((blog) => ({
                id: blog._id,
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt ?? "",
                category: blog.category?.name ?? "Uncategorized",
                author: blog.author?.name ?? "ADM Team",
                coverImage: blog.featuredImage?.url ?? blog.featuredImage?.path ?? "https://images.unsplash.com/photo-1499756823156-0c0c9d8c2c5a?w=900&q=80",
                status: blog.status === "published" ? "Published" : "Draft",
                featured: blog.featured,
                views: blog.views,
                readingTime: blog.readingTime,
                publishedAt: blog.publishedAt ?? "",
            })));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBlogs().catch(() => setBlogs([]));
    }, []);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("All Categories");

    const categories = useMemo(() => [
        "All Categories",
        ...Array.from(new Set(blogs.map((blog) => blog.category).filter(Boolean))),
    ], [blogs]);

    const [status, setStatus] =
        useState<"All" | BlogStatus>("All");

    const [menuId, setMenuId] =
        useState<string | null>(null);

    const [deleteId, setDeleteId] =
        useState<string | null>(null);

    const filteredBlogs = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return blogs.filter((blog) => {
            const matchesSearch =
                !query ||
                blog.title
                    .toLowerCase()
                    .includes(query) ||
                blog.excerpt
                    .toLowerCase()
                    .includes(query) ||
                blog.slug
                    .toLowerCase()
                    .includes(query);

            const matchesCategory =
                category ===
                "All Categories" ||
                blog.category === category;

            const matchesStatus =
                status === "All" ||
                blog.status === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [
        blogs,
        search,
        category,
        status,
    ]);

    const published =
        blogs.filter(
            (blog) =>
                blog.status ===
                "Published"
        ).length;

    const drafts =
        blogs.filter(
            (blog) =>
                blog.status === "Draft"
        ).length;

    const featured =
        blogs.filter(
            (blog) => blog.featured
        ).length;

    const totalViews =
        blogs.reduce(
            (sum, blog) =>
                sum + blog.views,
            0
        );

    async function toggleStatus(id: string) {
        const blog = blogs.find((item) => item.id === id);
        if (!blog) return;

        await fetch(`/api/blogs/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: blog.status === "Published" ? "draft" : "published" }),
        });
        await loadBlogs();
    }

    async function toggleFeatured(id: string) {
        await fetch(`/api/blogs/${id}/featured`, { method: "PATCH" });
        await loadBlogs();
    }

    async function deleteBlog() {
        if (!deleteId) return;

        await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        await loadBlogs();
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {loading && (
                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                    Loading blogs...
                </p>
            )}

            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        Content Management
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Blogs
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Create, manage and publish
                        ADM articles.
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push(
                            "/admin/blogs/new"
                        )
                    }
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    New Blog
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    label="Total Blogs"
                    value={blogs.length}
                />

                <Stat
                    label="Published"
                    value={published}
                    valueClass="text-emerald-600"
                />

                <Stat
                    label="Drafts"
                    value={drafts}
                    valueClass="text-amber-600"
                />

                <Stat
                    label="Total Views"
                    value={totalViews.toLocaleString()}
                    valueClass="text-blue-600"
                />
            </section>

            {/* Filters */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search blogs..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target
                                    .value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500"
                    >
                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>

                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            "All",
                            "Published",
                            "Draft",
                        ].map((item) => (
                            <button
                                key={item}
                                onClick={() =>
                                    setStatus(
                                        item as
                                        | "All"
                                        | BlogStatus
                                    )
                                }
                                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${status ===
                                    item
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured summary */}

            {featured > 0 && (
                <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Star
                                size={18}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-black text-slate-900">
                                {featured} featured{" "}
                                {featured ===
                                    1
                                    ? "article"
                                    : "articles"}
                            </p>

                            <p className="text-xs text-slate-500">
                                Featured articles can
                                be highlighted on the
                                public blog.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Desktop table */}

            <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Article
                                </th>

                                <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Category
                                </th>

                                <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Author
                                </th>

                                <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Status
                                </th>

                                <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Views
                                </th>

                                <th className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBlogs.map(
                                (blog) => (
                                    <BlogRow
                                        key={
                                            blog.id
                                        }
                                        blog={blog}
                                        menuId={
                                            menuId
                                        }
                                        setMenuId={
                                            setMenuId
                                        }
                                        onEdit={() =>
                                            router.push(
                                                `/admin/blogs/edit/${blog.id}`
                                            )
                                        }
                                        onDelete={() =>
                                            setDeleteId(
                                                blog.id
                                            )
                                        }
                                        onStatus={() =>
                                            toggleStatus(
                                                blog.id
                                            )
                                        }
                                        onFeatured={() =>
                                            toggleFeatured(
                                                blog.id
                                            )
                                        }
                                    />
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Mobile cards */}

            <section className="space-y-3 lg:hidden">
                {filteredBlogs.map(
                    (blog) => (
                        <article
                            key={blog.id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="flex gap-4 p-4">
                                <img
                                    src={
                                        blog.coverImage
                                    }
                                    alt=""
                                    className="h-20 w-24 shrink-0 rounded-xl object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge>
                                            {
                                                blog.category
                                            }
                                        </Badge>

                                        <StatusBadge
                                            status={
                                                blog.status
                                            }
                                        />
                                    </div>

                                    <h2 className="mt-2 line-clamp-2 text-sm font-black leading-5 text-slate-900">
                                        {
                                            blog.title
                                        }
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {
                                            blog.author
                                        }{" "}
                                        ·{" "}
                                        {
                                            blog.readingTime
                                        }{" "}
                                        min read
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                                <div className="flex gap-3 text-xs font-semibold text-slate-400">
                                    <span className="inline-flex items-center gap-1">
                                        <Eye
                                            size={13}
                                        />
                                        {blog.views.toLocaleString()}
                                    </span>

                                    {blog.featured && (
                                        <Star
                                            size={14}
                                            className="text-blue-600"
                                            fill="currentColor"
                                        />
                                    )}

                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/admin/blogs/edit/${blog.id}`
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
                                            setDeleteId(
                                                blog.id
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
            </section>

            {filteredBlogs.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
                    <p className="font-black text-slate-900">
                        No blogs found
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Try changing your search or
                        filters.
                    </p>
                </div>
            )}

            {/* Delete confirmation */}

            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={20} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete article?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This action will remove the
                            article from the current
                            management list.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() =>
                                    setDeleteId(
                                        null
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    deleteBlog
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BlogRow({
    blog,
    menuId,
    setMenuId,
    onEdit,
    onDelete,
    onStatus,
    onFeatured,
}: {
    blog: Blog;
    menuId: string | null;
    setMenuId: (
        value: string | null
    ) => void;
    onEdit: () => void;
    onDelete: () => void;
    onStatus: () => void;
    onFeatured: () => void;
}) {
    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <img
                        src={blog.coverImage}
                        alt=""
                        className="h-14 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 max-w-[350px]">
                        <div className="flex items-center gap-2">
                            {blog.featured && (
                                <Star
                                    size={13}
                                    className="shrink-0 text-blue-600"
                                    fill="currentColor"
                                />
                            )}

                        </div>

                        <p className="mt-1 truncate text-sm font-black text-slate-900">
                            {blog.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                            /blogs/
                            {blog.slug}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <Badge>
                    {blog.category}
                </Badge>
            </td>

            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                {blog.author}
            </td>

            <td className="px-4 py-4">
                <button
                    onClick={onStatus}
                    title="Toggle status"
                >
                    <StatusBadge
                        status={blog.status}
                    />
                </button>
            </td>

            <td className="px-4 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Eye
                        size={15}
                        className="text-slate-400"
                    />
                    {blog.views.toLocaleString()}
                </span>
            </td>

            <td className="relative px-4 py-4 text-right">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={onEdit}
                        className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <Edit3 size={16} />
                    </button>

                    <button
                        onClick={onDelete}
                        className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={16} />
                    </button>

                    <button
                        onClick={() =>
                            setMenuId(
                                menuId ===
                                    blog.id
                                    ? null
                                    : blog.id
                            )
                        }
                        className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100"
                    >
                        <MoreHorizontal
                            size={16}
                        />
                    </button>
                </div>

                {menuId === blog.id && (
                    <div className="absolute right-4 top-14 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                        <button
                            onClick={onFeatured}
                            className="w-full rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                            Toggle Featured
                        </button>

                        <button
                            onClick={onStatus}
                            className="w-full rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                            Toggle Status
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

function Stat({
    label,
    value,
    valueClass = "text-slate-900",
}: {
    label: string;
    value: string | number;
    valueClass?: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
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

function Badge({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex max-w-[180px] truncate rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
            {children}
        </span>
    );
}

function StatusBadge({
    status,
}: {
    status: BlogStatus;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${status === "Published"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
                }`}
        >
            {status}
        </span>
    );
}