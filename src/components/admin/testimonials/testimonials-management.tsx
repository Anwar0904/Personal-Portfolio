"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Edit3,
    Plus,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react";

type TestimonialStatus = "Published" | "Draft";

type Testimonial = {
    id: string;
    clientName: string;
    clientRole: string;
    company: string;
    content: string;
    avatar: string;
    rating: number;
    status: TestimonialStatus;
    featured: boolean;
    createdAt: string;
};

const initialTestimonials: Testimonial[] = [
    {
        id: "1",
        clientName: "James Anderson",
        clientRole: "CEO",
        company: "Nexora Technologies",
        content:
            "ADM transformed our digital presence completely. The team understood our goals, delivered a premium product and maintained excellent communication throughout the project.",
        avatar:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
        rating: 5,
        status: "Published",
        featured: true,
        createdAt: "2026-07-25",
    },
    {
        id: "2",
        clientName: "Sophia Williams",
        clientRole: "Marketing Director",
        company: "Vertex Solutions",
        content:
            "Working with ADM was an excellent experience. Their design thinking and technical execution helped us launch faster and with a much stronger user experience.",
        avatar:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        rating: 5,
        status: "Published",
        featured: true,
        createdAt: "2026-07-18",
    },
    {
        id: "3",
        clientName: "Daniel Carter",
        clientRole: "Founder",
        company: "Orbit Labs",
        content:
            "The ADM team was professional, creative and highly responsive. They turned our idea into a polished digital product that our customers genuinely enjoy using.",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        rating: 4,
        status: "Published",
        featured: false,
        createdAt: "2026-07-12",
    },
];

export default function TestimonialsManagement() {
    const [testimonials, setTestimonials] =
        useState<Testimonial[]>(
            initialTestimonials
        );

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<
            "All" | TestimonialStatus
        >("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Testimonial | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Testimonial | null>(null);

    const [clientName, setClientName] =
        useState("");

    const [clientRole, setClientRole] =
        useState("");

    const [company, setCompany] =
        useState("");

    const [content, setContent] =
        useState("");

    const [avatar, setAvatar] =
        useState("");

    const [rating, setRating] =
        useState(5);

    const [status, setStatus] =
        useState<TestimonialStatus>(
            "Published"
        );

    const [featured, setFeatured] =
        useState(false);

    const filteredTestimonials =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return testimonials.filter(
                (testimonial) => {
                    const matchesSearch =
                        !query ||
                        testimonial.clientName
                            .toLowerCase()
                            .includes(query) ||
                        testimonial.clientRole
                            .toLowerCase()
                            .includes(query) ||
                        testimonial.company
                            .toLowerCase()
                            .includes(query) ||
                        testimonial.content
                            .toLowerCase()
                            .includes(query);

                    const matchesStatus =
                        statusFilter ===
                        "All" ||
                        testimonial.status ===
                        statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            testimonials,
            search,
            statusFilter,
        ]);

    const publishedCount =
        testimonials.filter(
            (item) =>
                item.status === "Published"
        ).length;

    const draftCount =
        testimonials.filter(
            (item) =>
                item.status === "Draft"
        ).length;

    const featuredCount =
        testimonials.filter(
            (item) => item.featured
        ).length;

    const averageRating =
        testimonials.length
            ? (
                testimonials.reduce(
                    (sum, item) =>
                        sum + item.rating,
                    0
                ) / testimonials.length
            ).toFixed(1)
            : "0.0";

    function resetForm() {
        setClientName("");
        setClientRole("");
        setCompany("");
        setContent("");
        setAvatar("");
        setRating(5);
        setStatus("Published");
        setFeatured(false);
        setEditing(null);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(
        testimonial: Testimonial
    ) {
        setEditing(testimonial);

        setClientName(
            testimonial.clientName
        );

        setClientRole(
            testimonial.clientRole
        );

        setCompany(
            testimonial.company
        );

        setContent(
            testimonial.content
        );

        setAvatar(
            testimonial.avatar
        );

        setRating(testimonial.rating);
        setStatus(testimonial.status);
        setFeatured(
            testimonial.featured
        );

        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !clientName.trim() ||
            !clientRole.trim() ||
            !company.trim() ||
            !content.trim() ||
            !avatar.trim()
        ) {
            return;
        }

        const values = {
            clientName:
                clientName.trim(),

            clientRole:
                clientRole.trim(),

            company:
                company.trim(),

            content:
                content.trim(),

            avatar:
                avatar.trim(),

            rating,

            status,

            featured,
        };

        if (editing) {
            setTestimonials(
                (current) =>
                    current.map(
                        (item) =>
                            item.id ===
                                editing.id
                                ? {
                                    ...item,
                                    ...values,
                                }
                                : item
                    )
            );
        } else {
            setTestimonials(
                (current) => [
                    {
                        id: crypto.randomUUID(),
                        ...values,
                        createdAt:
                            new Date()
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                ),
                    },
                    ...current,
                ]
            );
        }

        closeForm();
    }

    function deleteTestimonial() {
        if (!deleteTarget) return;

        setTestimonials(
            (current) =>
                current.filter(
                    (item) =>
                        item.id !==
                        deleteTarget.id
                )
        );

        setDeleteTarget(null);
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Social Proof
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Testimonials
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage client feedback and
                        testimonials displayed across
                        ADM.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Testimonial
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total"
                    value={
                        testimonials.length
                    }
                />

                <StatCard
                    label="Published"
                    value={publishedCount}
                    valueClass="text-emerald-600"
                />

                <StatCard
                    label="Drafts"
                    value={draftCount}
                    valueClass="text-amber-600"
                />

                <StatCard
                    label="Average Rating"
                    value={averageRating}
                    valueClass="text-blue-600"
                    icon={
                        <Star
                            size={18}
                            className="fill-current"
                        />
                    }
                    extra={`${featuredCount} featured`}
                />
            </section>

            {/* Filters */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
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
                            placeholder="Search testimonials..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            "All",
                            "Published",
                            "Draft",
                        ].map((filter) => (
                            <button
                                key={filter}
                                onClick={() =>
                                    setStatusFilter(
                                        filter as
                                        | "All"
                                        | TestimonialStatus
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}

            {filteredTestimonials.length >
                0 ? (
                <section className="grid gap-5 lg:grid-cols-2">
                    {filteredTestimonials.map(
                        (testimonial) => (
                            <article
                                key={
                                    testimonial.id
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <img
                                            src={
                                                testimonial.avatar
                                            }
                                            alt={
                                                testimonial.clientName
                                            }
                                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-4 ring-slate-50"
                                        />

                                        <div className="min-w-0">
                                            <h2 className="truncate font-black text-slate-900">
                                                {
                                                    testimonial.clientName
                                                }
                                            </h2>

                                            <p className="mt-0.5 truncate text-sm font-semibold text-blue-600">
                                                {
                                                    testimonial.clientRole
                                                }
                                            </p>

                                            <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                                                {
                                                    testimonial.company
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            onClick={() =>
                                                openEdit(
                                                    testimonial
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
                                            onClick={() =>
                                                setDeleteTarget(
                                                    testimonial
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

                                <div className="mt-5 flex items-center justify-between gap-3">
                                    <div className="flex gap-0.5">
                                        {Array.from(
                                            {
                                                length: 5,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <Star
                                                    key={
                                                        index
                                                    }
                                                    size={
                                                        16
                                                    }
                                                    className={
                                                        index <
                                                            testimonial.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-slate-200"
                                                    }
                                                />
                                            )
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {testimonial.featured && (
                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                                                FEATURED
                                            </span>
                                        )}

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${testimonial.status ===
                                                    "Published"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {
                                                testimonial.status
                                            }
                                        </span>
                                    </div>
                                </div>

                                <blockquote className="mt-5 text-sm leading-7 text-slate-600">
                                    “
                                    {
                                        testimonial.content
                                    }
                                    ”
                                </blockquote>

                                <div className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                                    Added{" "}
                                    {
                                        testimonial.createdAt
                                    }
                                </div>
                            </article>
                        )
                    )}
                </section>
            ) : (
                <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                    <h2 className="font-black text-slate-900">
                        No testimonials found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Try changing your search or
                        filter.
                    </p>
                </section>
            )}

            {/* Form Modal */}

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
                    <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Testimonials
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Testimonial"
                                        : "Add Testimonial"}
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

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5 p-6"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Client Name">
                                    <input
                                        required
                                        value={
                                            clientName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setClientName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="John Doe"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Client Role">
                                    <input
                                        required
                                        value={
                                            clientRole
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setClientRole(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="CEO"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Company">
                                    <input
                                        required
                                        value={
                                            company
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCompany(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Company name"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Rating">
                                    <div className="flex h-11 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3">
                                        {[
                                            1,
                                            2,
                                            3,
                                            4,
                                            5,
                                        ].map(
                                            (
                                                value
                                            ) => (
                                                <button
                                                    type="button"
                                                    key={
                                                        value
                                                    }
                                                    onClick={() =>
                                                        setRating(
                                                            value
                                                        )
                                                    }
                                                    className="p-1"
                                                >
                                                    <Star
                                                        size={
                                                            20
                                                        }
                                                        className={
                                                            value <=
                                                                rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-slate-300"
                                                        }
                                                    />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </Field>
                            </div>

                            <Field label="Avatar URL">
                                <input
                                    required
                                    value={
                                        avatar
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAvatar(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="input"
                                />
                            </Field>

                            <Field label="Testimonial">
                                <textarea
                                    required
                                    rows={6}
                                    value={
                                        content
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setContent(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Write the client's testimonial..."
                                    className="input min-h-36 resize-none py-3"
                                />
                            </Field>

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
                                                    .value as TestimonialStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="Published">
                                            Published
                                        </option>

                                        <option value="Draft">
                                            Draft
                                        </option>
                                    </select>
                                </Field>

                                <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 p-4">
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
                                            Featured
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Highlight on
                                            public pages.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create Testimonial"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete testimonial?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This will remove the
                            testimonial from the
                            current admin list.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    deleteTestimonial
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

function StatCard({
    label,
    value,
    valueClass = "text-slate-900",
    icon,
    extra,
}: {
    label: string;
    value: string | number;
    valueClass?: string;
    icon?: React.ReactNode;
    extra?: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-2">
                <p
                    className={`text-3xl font-black ${valueClass}`}
                >
                    {value}
                </p>

                {icon}
            </div>

            {extra && (
                <p className="mt-1 text-xs font-semibold text-slate-400">
                    {extra}
                </p>
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
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>

            {children}
        </div>
    );
}