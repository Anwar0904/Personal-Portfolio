"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ShieldCheck,
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Star,
    Users,
    KeyRound,
    RefreshCw,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

type Role = {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
    isDefault: boolean;
    status: string;
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
};

type ApiResult<T> = {
    success: boolean;
    data: T;
    message?: string;
};

type RolesResponse = {
    roles: Role[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const PERMISSION_GROUPS = [
    {
        label: "Dashboard",
        permissions: [
            "dashboard.read",
        ],
    },
    {
        label: "Users",
        permissions: [
            "user.read",
            "user.create",
            "user.update",
            "user.delete",
        ],
    },
    {
        label: "Roles",
        permissions: [
            "role.read",
            "role.create",
            "role.update",
            "role.delete",
        ],
    },
    {
        label: "Blogs",
        permissions: [
            "blog.read",
            "blog.create",
            "blog.update",
            "blog.delete",
        ],
    },
    {
        label: "Categories",
        permissions: [
            "category.read",
            "category.create",
            "category.update",
            "category.delete",
        ],
    },
    {
        label: "Tags",
        permissions: [
            "tag.read",
            "tag.create",
            "tag.update",
            "tag.delete",
        ],
    },
    {
        label: "Services",
        permissions: [
            "service.read",
            "service.create",
            "service.update",
            "service.delete",
        ],
    },
    {
        label: "Portfolio",
        permissions: [
            "portfolio.read",
            "portfolio.create",
            "portfolio.update",
            "portfolio.delete",
        ],
    },
    {
        label: "Team",
        permissions: [
            "team.read",
            "team.create",
            "team.update",
            "team.delete",
        ],
    },
    {
        label: "Testimonials",
        permissions: [
            "testimonial.read",
            "testimonial.create",
            "testimonial.update",
            "testimonial.delete",
        ],
    },
    {
        label: "FAQs",
        permissions: [
            "faq.read",
            "faq.create",
            "faq.update",
            "faq.delete",
        ],
    },
    {
        label: "Consultations",
        permissions: [
            "consultation.read",
            "consultation.create",
            "consultation.update",
            "consultation.delete",
        ],
    },
    {
        label: "Media",
        permissions: [
            "media.read",
            "media.create",
            "media.update",
            "media.delete",
        ],
    },
    {
        label: "Settings",
        permissions: [
            "settings.read",
            "settings.update",
        ],
    },
];

const ALL_PERMISSIONS =
    PERMISSION_GROUPS.flatMap(
        (group) => group.permissions
    );

function humanizePermission(
    permission: string
) {
    return permission
        .split(".")
        .map((part) =>
            part.charAt(0).toUpperCase() +
            part.slice(1)
        )
        .join(" ");
}

function humanizeRole(name: string) {
    return name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}

function getErrorMessage(
    error: unknown
) {
    return error instanceof Error
        ? error.message
        : "Something went wrong.";
}

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>(
        []
    );

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [selectedRole, setSelectedRole] =
        useState<Role | null>(null);

    const [showForm, setShowForm] =
        useState(false);

    const [showPermissions, setShowPermissions] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState<Role | null>(null);

    const fetchRoles = useCallback(
        async (
            options: {
                silent?: boolean;
            } = {}
        ) => {
            try {
                if (!options.silent) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                setError("");

                const params =
                    new URLSearchParams();

                params.set("page", String(page));
                params.set("limit", "10");

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (status) {
                    params.set("status", status);
                }

                const response =
                    await fetch(
                        `/api/roles?${params.toString()}`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<RolesResponse>;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to load roles."
                    );
                }

                setRoles(result.data.roles);
                setTotal(
                    result.data.pagination.total
                );
                setTotalPages(
                    result.data.pagination.totalPages
                );
            } catch (error) {
                setError(
                    getErrorMessage(error)
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [page, search, status]
    );

    useEffect(() => {
        const timer = setTimeout(
            () => {
                fetchRoles();
            },
            300
        );

        return () => clearTimeout(timer);
    }, [fetchRoles]);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    async function handleDelete() {
        if (!deleteTarget) return;

        try {
            const response =
                await fetch(
                    `/api/roles/${deleteTarget._id}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

            const result =
                (await response.json()) as ApiResult<null>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Unable to delete role."
                );
            }

            setDeleteTarget(null);

            await fetchRoles({
                silent: true,
            });
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        }
    }

    async function handleSetDefault(
        role: Role
    ) {
        if (role.isDefault) return;

        try {
            const response =
                await fetch(
                    `/api/roles/${role._id}/default`,
                    {
                        method: "PATCH",
                        credentials: "include",
                    }
                );

            const result =
                (await response.json()) as ApiResult<Role>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Unable to set default role."
                );
            }

            await fetchRoles({
                silent: true,
            });
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        }
    }

    const activeCount = useMemo(
        () =>
            roles.filter(
                (role) =>
                    role.status === "active"
            ).length,
        [roles]
    );

    const defaultRole = useMemo(
        () =>
            roles.find(
                (role) => role.isDefault
            ),
        [roles]
    );

    return (
        <div className="min-h-screen bg-[#f7f8fa]">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                {/* Header */}
                <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                            <ShieldCheck
                                size={16}
                            />
                            Administration
                            <span>/</span>
                            Roles
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                            Roles & Permissions
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Control what each team role can access
                            across the ADM platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                fetchRoles({
                                    silent: true,
                                })
                            }
                            disabled={refreshing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            <span className="hidden sm:inline">
                                Refresh
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedRole(null);
                                setShowForm(true);
                            }}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
                        >
                            <Plus size={17} />
                            New Role
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatCard
                        icon={<ShieldCheck size={18} />}
                        label="Total Roles"
                        value={total}
                    />

                    <StatCard
                        icon={<Users size={18} />}
                        label="Active Roles"
                        value={activeCount}
                    />

                    <StatCard
                        icon={<Star size={18} />}
                        label="Default Role"
                        value={
                            defaultRole
                                ? humanizeRole(
                                    defaultRole.name
                                )
                                : "None"
                        }
                        compact
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <X
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="flex-1">
                            {error}
                        </div>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="font-semibold hover:underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search roles..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 outline-none focus:border-gray-400 focus:bg-white md:w-44"
                        >
                            <option value="">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {loading ? (
                        <RolesSkeleton />
                    ) : roles.length === 0 ? (
                        <EmptyState
                            search={Boolean(
                                search || status
                            )}
                            onCreate={() => {
                                setSelectedRole(null);
                                setShowForm(true);
                            }}
                        />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[820px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/80 text-left">
                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Role
                                            </th>

                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Permissions
                                            </th>

                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Users
                                            </th>

                                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {roles.map((role) => (
                                            <RoleRow
                                                key={role._id}
                                                role={role}
                                                onEdit={() => {
                                                    setSelectedRole(role);
                                                    setShowForm(true);
                                                }}
                                                onPermissions={() => {
                                                    setSelectedRole(role);
                                                    setShowPermissions(true);
                                                }}
                                                onDelete={() =>
                                                    setDeleteTarget(
                                                        role
                                                    )
                                                }
                                                onDefault={() =>
                                                    handleSetDefault(
                                                        role
                                                    )
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-700">
                                        {roles.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-700">
                                        {total}
                                    </span>{" "}
                                    roles
                                </p>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage(
                                                (current) =>
                                                    Math.max(
                                                        1,
                                                        current - 1
                                                    )
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={16}
                                        />
                                    </button>

                                    <span className="px-3 text-sm font-semibold text-gray-700">
                                        {page} / {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            page >= totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                (current) =>
                                                    Math.min(
                                                        totalPages,
                                                        current + 1
                                                    )
                                            )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
                                    >
                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showForm && (
                <RoleFormModal
                    role={selectedRole}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedRole(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setSelectedRole(null);
                        fetchRoles({
                            silent: true,
                        });
                    }}
                />
            )}

            {showPermissions &&
                selectedRole && (
                    <PermissionsModal
                        role={selectedRole}
                        onClose={() => {
                            setShowPermissions(false);
                            setSelectedRole(null);
                        }}
                        onSuccess={() => {
                            setShowPermissions(false);
                            setSelectedRole(null);
                            fetchRoles({
                                silent: true,
                            });
                        }}
                    />
                )}

            {deleteTarget && (
                <DeleteModal
                    role={deleteTarget}
                    onClose={() =>
                        setDeleteTarget(null)
                    }
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    compact = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    compact?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                {icon}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {label}
            </p>

            <p
                className={
                    compact
                        ? "mt-1 truncate text-lg font-bold text-gray-950"
                        : "mt-1 text-2xl font-bold text-gray-950"
                }
            >
                {value}
            </p>
        </div>
    );
}

function RoleRow({
    role,
    onEdit,
    onPermissions,
    onDelete,
    onDefault,
}: {
    role: Role;
    onEdit: () => void;
    onPermissions: () => void;
    onDelete: () => void;
    onDefault: () => void;
}) {
    const [menuOpen, setMenuOpen] =
        useState(false);

    return (
        <tr className="group transition hover:bg-gray-50/70">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white">
                        <ShieldCheck
                            size={18}
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-950">
                                {humanizeRole(
                                    role.name
                                )}
                            </p>

                            {role.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                                    <Star
                                        size={11}
                                        fill="currentColor"
                                    />
                                    Default
                                </span>
                            )}
                        </div>

                        {role.description && (
                            <p className="mt-0.5 max-w-[300px] truncate text-xs text-gray-500">
                                {role.description}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <button
                    type="button"
                    onClick={onPermissions}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                    <KeyRound size={13} />
                    {role.permissions.length} permissions
                </button>
            </td>

            <td className="px-5 py-4">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <Users size={15} />
                    <span className="font-semibold text-gray-800">
                        {role.userCount ?? 0}
                    </span>
                </div>
            </td>

            <td className="px-5 py-4">
                <StatusBadge
                    status={role.status}
                />
            </td>

            <td className="relative px-5 py-4 text-right">
                <button
                    type="button"
                    onClick={() =>
                        setMenuOpen(
                            (current) => !current
                        )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                    <MoreHorizontal
                        size={18}
                    />
                </button>

                {menuOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        <div className="absolute right-5 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 text-left shadow-xl">
                            <MenuButton
                                icon={
                                    <Pencil size={15} />
                                }
                                label="Edit role"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit();
                                }}
                            />

                            <MenuButton
                                icon={
                                    <KeyRound size={15} />
                                }
                                label="Manage permissions"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onPermissions();
                                }}
                            />

                            {!role.isDefault && (
                                <MenuButton
                                    icon={
                                        <Star size={15} />
                                    }
                                    label="Make default"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDefault();
                                    }}
                                />
                            )}

                            {!role.isDefault && (
                                <MenuButton
                                    danger
                                    icon={
                                        <Trash2 size={15} />
                                    }
                                    label="Delete role"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete();
                                    }}
                                />
                            )}
                        </div>
                    </>
                )}
            </td>
        </tr>
    );
}

function MenuButton({
    icon,
    label,
    onClick,
    danger = false,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${danger
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-50"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const active =
        status.toLowerCase() ===
        "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-600"
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${active
                    ? "bg-emerald-500"
                    : "bg-gray-400"
                    }`}
            />

            {active
                ? "Active"
                : "Inactive"}
        </span>
    );
}

function RolesSkeleton() {
    return (
        <div className="divide-y divide-gray-100">
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-5 px-5 py-5"
                >
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />

                    <div className="flex-1">
                        <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="hidden h-7 w-28 animate-pulse rounded-lg bg-gray-100 sm:block" />
                    <div className="hidden h-4 w-12 animate-pulse rounded bg-gray-100 sm:block" />
                    <div className="hidden h-7 w-16 animate-pulse rounded-full bg-gray-100 sm:block" />
                </div>
            ))}
        </div>
    );
}

function EmptyState({
    search,
    onCreate,
}: {
    search: boolean;
    onCreate: () => void;
}) {
    return (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <ShieldCheck size={25} />
            </div>

            <h3 className="text-lg font-bold text-gray-950">
                {search
                    ? "No matching roles"
                    : "No roles yet"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {search
                    ? "Try changing your search or filters."
                    : "Create your first role to start managing permissions."}
            </p>

            {!search && (
                <button
                    type="button"
                    onClick={onCreate}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white"
                >
                    <Plus size={16} />
                    Create Role
                </button>
            )}
        </div>
    );
}

function RoleFormModal({
    role,
    onClose,
    onSuccess,
}: {
    role: Role | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const editing = Boolean(role);

    const [name, setName] =
        useState(
            role?.name ?? ""
        );

    const [description, setDescription] =
        useState(
            role?.description ?? ""
        );

    const [status, setStatus] =
        useState(
            role?.status ?? "active"
        );

    const [isDefault, setIsDefault] =
        useState(
            role?.isDefault ?? false
        );

    const [permissions, setPermissions] =
        useState<string[]>(
            role?.permissions ?? []
        );

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    function togglePermission(
        permission: string
    ) {
        setPermissions(
            (current) =>
                current.includes(permission)
                    ? current.filter(
                        (item) =>
                            item !== permission
                    )
                    : [
                        ...current,
                        permission,
                    ]
        );
    }

    function toggleGroup(
        groupPermissions: string[]
    ) {
        const allSelected =
            groupPermissions.every(
                (permission) =>
                    permissions.includes(
                        permission
                    )
            );

        setPermissions(
            (current) =>
                allSelected
                    ? current.filter(
                        (permission) =>
                            !groupPermissions.includes(
                                permission
                            )
                    )
                    : [
                        ...current,
                        ...groupPermissions.filter(
                            (permission) =>
                                !current.includes(
                                    permission
                                )
                        ),
                    ]
        );
    }

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const payload = {
                name: name.trim(),
                description:
                    description.trim(),
                permissions,
                status,
                isDefault,
            };

            const response =
                await fetch(
                    editing
                        ? `/api/roles/${role!._id}`
                        : "/api/roles",
                    {
                        method: editing
                            ? "PATCH"
                            : "POST",
                        credentials: "include",
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
                (await response.json()) as ApiResult<Role>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Unable to save role."
                );
            }

            onSuccess();
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell
            title={
                editing
                    ? "Edit role"
                    : "Create role"
            }
            subtitle={
                editing
                    ? "Update role details and access permissions."
                    : "Create a role and define what it can access."
            }
            onClose={onClose}
        >
            <form
                onSubmit={submit}
                className="space-y-5"
            >
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Role name"
                        required
                    >
                        <input
                            required
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. content editor"
                            className="input"
                        />
                    </Field>

                    <Field label="Status">
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            className="input"
                        >
                            <option value="active">
                                Active
                            </option>
                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </Field>
                </div>

                <Field label="Description">
                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        rows={3}
                        placeholder="Describe what this role is responsible for..."
                        className="input resize-none"
                    />
                </Field>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(event) =>
                                setIsDefault(
                                    event.target.checked
                                )
                            }
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-950"
                        />

                        <span>
                            <span className="block text-sm font-semibold text-gray-900">
                                Default role
                            </span>
                            <span className="mt-0.5 block text-xs text-gray-500">
                                New users can be assigned this
                                role automatically.
                            </span>
                        </span>
                    </label>
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                Permissions
                            </p>
                            <p className="text-xs text-gray-500">
                                {permissions.length} of{" "}
                                {ALL_PERMISSIONS.length} selected
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setPermissions(
                                    permissions.length ===
                                        ALL_PERMISSIONS.length
                                        ? []
                                        : [...ALL_PERMISSIONS]
                                )
                            }
                            className="text-xs font-bold text-gray-700 hover:underline"
                        >
                            {permissions.length ===
                                ALL_PERMISSIONS.length
                                ? "Clear all"
                                : "Select all"}
                        </button>
                    </div>

                    <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                        {PERMISSION_GROUPS.map(
                            (group) => {
                                const selectedCount =
                                    group.permissions.filter(
                                        (permission) =>
                                            permissions.includes(
                                                permission
                                            )
                                    ).length;

                                const complete =
                                    selectedCount ===
                                    group.permissions.length;

                                return (
                                    <div
                                        key={group.label}
                                        className="rounded-xl border border-gray-200 bg-white"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleGroup(
                                                    group.permissions
                                                )
                                            }
                                            className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                                        >
                                            <span className="text-xs font-bold text-gray-800">
                                                {group.label}
                                            </span>

                                            <span className="text-[11px] font-semibold text-gray-400">
                                                {selectedCount}/
                                                {group.permissions.length}
                                            </span>
                                        </button>

                                        <div className="grid gap-1 border-t border-gray-100 p-2 sm:grid-cols-2">
                                            {group.permissions.map(
                                                (permission) => (
                                                    <label
                                                        key={permission}
                                                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={permissions.includes(
                                                                permission
                                                            )}
                                                            onChange={() =>
                                                                togglePermission(
                                                                    permission
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 accent-gray-950"
                                                        />

                                                        <span className="text-xs text-gray-600">
                                                            {humanizePermission(
                                                                permission
                                                            )}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>

                                        {complete && (
                                            <span className="sr-only">
                                                All permissions selected
                                            </span>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                <ModalActions
                    onClose={onClose}
                    loading={saving}
                    submitLabel={
                        editing
                            ? "Save Changes"
                            : "Create Role"
                    }
                />
            </form>
        </ModalShell>
    );
}

function PermissionsModal({
    role,
    onClose,
    onSuccess,
}: {
    role: Role;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [permissions, setPermissions] =
        useState<string[]>(
            role.permissions
        );

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    function toggle(
        permission: string
    ) {
        setPermissions(
            (current) =>
                current.includes(permission)
                    ? current.filter(
                        (item) =>
                            item !== permission
                    )
                    : [
                        ...current,
                        permission,
                    ]
        );
    }

    async function save() {
        try {
            setSaving(true);
            setError("");

            const response =
                await fetch(
                    `/api/roles/${role._id}/permissions`,
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            permissions,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Role>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Unable to update permissions."
                );
            }

            onSuccess();
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell
            title={`${humanizeRole(role.name)} permissions`}
            subtitle="Manage exactly what this role can access."
            onClose={onClose}
        >
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                    <p className="text-sm font-bold text-gray-900">
                        Selected permissions
                    </p>
                    <p className="text-xs text-gray-500">
                        {permissions.length} /{" "}
                        {ALL_PERMISSIONS.length}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setPermissions(
                            permissions.length ===
                                ALL_PERMISSIONS.length
                                ? []
                                : [...ALL_PERMISSIONS]
                        )
                    }
                    className="text-xs font-bold text-gray-700 hover:underline"
                >
                    {permissions.length ===
                        ALL_PERMISSIONS.length
                        ? "Clear all"
                        : "Select all"}
                </button>
            </div>

            <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
                {PERMISSION_GROUPS.map(
                    (group) => {
                        const selected =
                            group.permissions.filter(
                                (permission) =>
                                    permissions.includes(
                                        permission
                                    )
                            ).length;

                        const all =
                            selected ===
                            group.permissions.length;

                        return (
                            <div
                                key={group.label}
                                className="rounded-xl border border-gray-200 p-3"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-800">
                                        {group.label}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPermissions(
                                                (current) =>
                                                    all
                                                        ? current.filter(
                                                            (item) =>
                                                                !group.permissions.includes(
                                                                    item
                                                                )
                                                        )
                                                        : [
                                                            ...current,
                                                            ...group.permissions.filter(
                                                                (item) =>
                                                                    !current.includes(
                                                                        item
                                                                    )
                                                            ),
                                                        ]
                                            )
                                        }
                                        className="text-[11px] font-bold text-gray-500 hover:text-gray-900"
                                    >
                                        {all
                                            ? "Clear"
                                            : "All"}
                                    </button>
                                </div>

                                <div className="grid gap-1 sm:grid-cols-2">
                                    {group.permissions.map(
                                        (permission) => (
                                            <label
                                                key={permission}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={permissions.includes(
                                                        permission
                                                    )}
                                                    onChange={() =>
                                                        toggle(
                                                            permission
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 accent-gray-950"
                                                />

                                                <span className="text-xs text-gray-600">
                                                    {humanizePermission(
                                                        permission
                                                    )}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={save}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                    {saving && (
                        <RefreshCw
                            size={15}
                            className="animate-spin"
                        />
                    )}

                    Save Permissions
                </button>
            </div>
        </ModalShell>
    );
}

function DeleteModal({
    role,
    onClose,
    onConfirm,
}: {
    role: Role;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}) {
    const [deleting, setDeleting] =
        useState(false);

    async function confirm() {
        try {
            setDeleting(true);
            await onConfirm();
        } finally {
            setDeleting(false);
        }
    }

    return (
        <ModalShell
            title="Delete role"
            subtitle="This action cannot be undone."
            onClose={onClose}
            narrow
        >
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <Trash2 size={17} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-900">
                            Delete{" "}
                            {humanizeRole(
                                role.name
                            )}
                            ?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-700">
                            The role will be removed from
                            the system. Roles assigned to
                            users or marked as default are
                            protected by the backend.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={deleting}
                    className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={confirm}
                    disabled={deleting}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                    {deleting && (
                        <RefreshCw
                            size={15}
                            className="animate-spin"
                        />
                    )}

                    Delete Role
                </button>
            </div>
        </ModalShell>
    );
}

function ModalShell({
    title,
    subtitle,
    onClose,
    children,
    narrow = false,
}: {
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: React.ReactNode;
    narrow?: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6">
            <div
                className={`flex max-h-[94vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${narrow
                    ? "max-w-md"
                    : "max-w-3xl"
                    }`}
            >
                <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-950">
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="mt-0.5 text-xs text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    required = false,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-gray-700">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

function ModalActions({
    onClose,
    loading,
    submitLabel,
}: {
    onClose: () => void;
    loading: boolean;
    submitLabel: string;
}) {
    return (
        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
                {loading && (
                    <RefreshCw
                        size={15}
                        className="animate-spin"
                    />
                )}

                {submitLabel}
            </button>
        </div>
    );
}