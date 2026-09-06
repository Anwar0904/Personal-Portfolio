"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Loader2,
    Mail,
    MoreHorizontal,
    Plus,
    RefreshCcw,
    Search,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    X,
} from "lucide-react";

type UserStatus =
    | "active"
    | "inactive"
    | "suspended"
    | "pending";

interface Role {
    _id: string;
    name: string;
    description?: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
    jobTitle?: string | null;
    role?: Role | null;
    status: UserStatus;
    isEmailVerified: boolean;
    lastLogin?: string | null;
    createdAt: string;
    updatedAt: string;
    isDeleted?: boolean;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UserResponse {
    users: User[];
    pagination: Pagination;
}

interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: UserStatus;
    phone: string;
    jobTitle: string;
    avatar: string;
    isEmailVerified: boolean;
}

const EMPTY_FORM: UserForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    status: "active",
    phone: "",
    jobTitle: "",
    avatar: "",
    isEmailVerified: false,
};

const STATUS_OPTIONS: UserStatus[] = [
    "active",
    "inactive",
    "suspended",
    "pending",
];

function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token")
    );
}

async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const token = getToken();

    const headers = new Headers(
        options.headers
    );

    headers.set(
        "Content-Type",
        "application/json"
    );

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const text = await response.text();

    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = {
            message:
                text ||
                "Invalid server response.",
        };
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            "Request failed."
        );
    }

    return data;
}

function getPayload<T>(response: any): T {
    return (
        response?.data ??
        response?.result ??
        response
    );
}

function getUserName(user: User) {
    return `${user.firstName} ${user.lastName ?? ""
        }`.trim();
}

function initials(user: User) {
    return (
        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""
        }`
    ).toUpperCase();
}

function formatDate(date?: string | null) {
    if (!date) return "Never";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "—";
    }

    return value.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}

function statusClasses(
    status: UserStatus
) {
    switch (status) {
        case "active":
            return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

        case "inactive":
            return "bg-slate-500/10 text-slate-600 border-slate-500/20";

        case "suspended":
            return "bg-red-500/10 text-red-600 border-red-500/20";

        case "pending":
            return "bg-amber-500/10 text-amber-600 border-amber-500/20";

        default:
            return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
}

function roleClasses(role?: string) {
    if (
        role?.toLowerCase() ===
        "super_admin"
    ) {
        return "bg-violet-500/10 text-violet-600 border-violet-500/20";
    }

    if (
        role?.toLowerCase() === "admin"
    ) {
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }

    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

function readableRole(role?: string) {
    if (!role) return "No role";

    return role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(
        []
    );

    const [roles, setRoles] = useState<Role[]>(
        []
    );

    const [pagination, setPagination] =
        useState<Pagination>({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        });

    const [search, setSearch] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState<User | null>(null);

    const [form, setForm] =
        useState<UserForm>(EMPTY_FORM);

    const [openMenu, setOpenMenu] =
        useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<User | null>(null);

    const [showDeleted, setShowDeleted] =
        useState(false);

    const [notice, setNotice] =
        useState("");

    const [mobileFilters, setMobileFilters] =
        useState(false);

    const fetchRoles = useCallback(
        async () => {
            try {
                const response =
                    await apiFetch(
                        "/api/roles?limit=100"
                    );

                const payload =
                    getPayload<any>(
                        response
                    );

                const roleList =
                    payload?.roles ??
                    payload ??
                    [];

                setRoles(
                    Array.isArray(roleList)
                        ? roleList
                        : []
                );
            } catch {
                // Role filtering remains functional
                // even if the optional roles request fails.
            }
        },
        []
    );

    const fetchUsers = useCallback(
        async () => {
            setLoading(true);
            setError("");

            try {
                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    pagination.page.toString()
                );

                params.set(
                    "limit",
                    pagination.limit.toString()
                );

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (roleFilter) {
                    params.set(
                        "role",
                        roleFilter
                    );
                }

                if (statusFilter) {
                    params.set(
                        "status",
                        statusFilter
                    );
                }

                if (showDeleted) {
                    params.set(
                        "includeDeleted",
                        "true"
                    );
                }

                const response =
                    await apiFetch(
                        `/api/users?${params.toString()}`
                    );

                const payload =
                    getPayload<UserResponse>(
                        response
                    );

                setUsers(
                    Array.isArray(
                        payload?.users
                    )
                        ? payload.users
                        : []
                );

                if (
                    payload?.pagination
                ) {
                    setPagination(
                        payload.pagination
                    );
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load users."
                );
            } finally {
                setLoading(false);
            }
        },
        [
            pagination.page,
            pagination.limit,
            search,
            roleFilter,
            statusFilter,
            showDeleted,
        ]
    );

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    useEffect(() => {
        const timer =
            setTimeout(() => {
                fetchUsers();
            }, 250);

        return () => clearTimeout(timer);
    }, [fetchUsers]);

    useEffect(() => {
        if (!notice) return;

        const timer =
            setTimeout(() => {
                setNotice("");
            }, 3500);

        return () => clearTimeout(timer);
    }, [notice]);

    const stats = useMemo(() => {
        const active = users.filter(
            (user) =>
                user.status === "active"
        ).length;

        const verified =
            users.filter(
                (user) =>
                    user.isEmailVerified
            ).length;

        const admins =
            users.filter((user) => {
                const role =
                    user.role?.name?.toLowerCase();

                return (
                    role === "admin" ||
                    role === "super_admin"
                );
            }).length;

        return {
            total: pagination.total,
            active,
            verified,
            admins,
        };
    }, [users, pagination.total]);

    function openCreate() {
        setEditingUser(null);
        setForm({
            ...EMPTY_FORM,
            role:
                roles.find(
                    (role) =>
                        role.name !==
                        "super_admin"
                )?._id ?? "",
        });
        setShowModal(true);
    }

    function openEdit(user: User) {
        setEditingUser(user);

        setForm({
            firstName:
                user.firstName ?? "",

            lastName:
                user.lastName ?? "",

            email: user.email ?? "",

            password: "",

            role:
                user.role?._id ?? "",

            status:
                user.status ?? "active",

            phone:
                user.phone ?? "",

            jobTitle:
                user.jobTitle ?? "",

            avatar:
                user.avatar ?? "",

            isEmailVerified:
                user.isEmailVerified ??
                false,
        });

        setShowModal(true);
        setOpenMenu(null);
    }

    function closeModal() {
        if (actionLoading) return;

        setShowModal(false);
        setEditingUser(null);
        setForm(EMPTY_FORM);
    }

    function updateForm(
        field: keyof UserForm,
        value: string | boolean
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function submitUser(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!form.firstName.trim()) {
            setError(
                "First name is required."
            );
            return;
        }

        if (!form.email.trim()) {
            setError(
                "Email is required."
            );
            return;
        }

        if (!editingUser && !form.password) {
            setError(
                "Password is required."
            );
            return;
        }

        if (!form.role) {
            setError(
                "Please select a role."
            );
            return;
        }

        setActionLoading(true);
        setError("");

        try {
            if (editingUser) {
                const payload: Record<
                    string,
                    unknown
                > = {
                    firstName:
                        form.firstName.trim(),

                    lastName:
                        form.lastName.trim(),

                    email:
                        form.email
                            .trim()
                            .toLowerCase(),

                    role: form.role,

                    status: form.status,

                    phone:
                        form.phone.trim() ||
                        null,

                    jobTitle:
                        form.jobTitle.trim() ||
                        null,

                    avatar:
                        form.avatar.trim() ||
                        null,

                    isEmailVerified:
                        form.isEmailVerified,
                };

                await apiFetch(
                    `/api/users/${editingUser._id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

                setNotice(
                    "User updated successfully."
                );
            } else {
                await apiFetch(
                    "/api/users",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            firstName:
                                form.firstName.trim(),

                            lastName:
                                form.lastName.trim(),

                            email:
                                form.email
                                    .trim()
                                    .toLowerCase(),

                            password:
                                form.password,

                            role: form.role,

                            status:
                                form.status,

                            phone:
                                form.phone.trim() ||
                                undefined,

                            jobTitle:
                                form.jobTitle.trim() ||
                                undefined,

                            avatar:
                                form.avatar.trim() ||
                                undefined,

                            isEmailVerified:
                                form.isEmailVerified,
                        }),
                    }
                );

                setNotice(
                    "User created successfully."
                );
            }

            closeModal();

            await fetchUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save user."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function changeStatus(
        user: User,
        status: UserStatus
    ) {
        setActionLoading(true);
        setOpenMenu(null);
        setError("");

        try {
            await apiFetch(
                `/api/users/${user._id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            setNotice(
                `User ${status === "active"
                    ? "activated"
                    : "status updated"
                } successfully.`
            );

            await fetchUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update status."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function deleteUser() {
        if (!deleteTarget) return;

        setActionLoading(true);
        setError("");

        try {
            await apiFetch(
                `/api/users/${deleteTarget._id}`,
                {
                    method: "DELETE",
                }
            );

            setNotice(
                "User moved to trash."
            );

            setDeleteTarget(null);

            await fetchUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete user."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function restoreUser(
        user: User
    ) {
        setActionLoading(true);
        setOpenMenu(null);
        setError("");

        try {
            await apiFetch(
                `/api/users/${user._id}/restore`,
                {
                    method: "PATCH",
                }
            );

            setNotice(
                "User restored successfully."
            );

            await fetchUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to restore user."
            );
        } finally {
            setActionLoading(false);
        }
    }

    function changePage(
        page: number
    ) {
        if (
            page < 1 ||
            page > pagination.totalPages
        ) {
            return;
        }

        setPagination((current) => ({
            ...current,
            page,
        }));
    }

    return (
        <main className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                {/* Header */}
                <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
                            <ShieldCheck className="h-4 w-4" />
                            Super Admin
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Users Management
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Manage ADM users,
                            access levels,
                            account status and
                            permissions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {notice && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        {notice}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Total Users"
                        value={stats.total}
                        icon={
                            <Users className="h-5 w-5" />
                        }
                    />

                    <StatCard
                        label="Active"
                        value={stats.active}
                        icon={
                            <UserCheck className="h-5 w-5" />
                        }
                    />

                    <StatCard
                        label="Verified"
                        value={stats.verified}
                        icon={
                            <Mail className="h-5 w-5" />
                        }
                    />

                    <StatCard
                        label="Admins"
                        value={stats.admins}
                        icon={
                            <ShieldCheck className="h-5 w-5" />
                        }
                    />
                </div>

                {/* Main card */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {/* Toolbar */}
                    <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="relative w-full xl:max-w-md">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(
                                            event.target.value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    placeholder="Search name, email or job title..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileFilters(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300 xl:hidden"
                                >
                                    Filters
                                </button>

                                <select
                                    value={roleFilter}
                                    onChange={(event) => {
                                        setRoleFilter(
                                            event.target.value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    className="hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-500 xl:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    <option value="">
                                        All roles
                                    </option>

                                    {roles.map(
                                        (role) => (
                                            <option
                                                key={
                                                    role._id
                                                }
                                                value={
                                                    role._id
                                                }
                                            >
                                                {readableRole(
                                                    role.name
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(event) => {
                                        setStatusFilter(
                                            event.target.value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    className="hidden h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-violet-500 xl:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    <option value="">
                                        All status
                                    </option>

                                    {STATUS_OPTIONS.map(
                                        (status) => (
                                            <option
                                                key={
                                                    status
                                                }
                                                value={
                                                    status
                                                }
                                            >
                                                {readableRole(
                                                    status
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>

                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchUsers()
                                    }
                                    disabled={loading}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    title="Refresh"
                                >
                                    <RefreshCcw
                                        className={`h-4 w-4 ${loading
                                            ? "animate-spin"
                                            : ""
                                            }`}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleted(
                                            (value) =>
                                                !value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${showDeleted
                                        ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Trash
                                    </span>
                                </button>
                            </div>
                        </div>

                        {mobileFilters && (
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:hidden">
                                <select
                                    value={roleFilter}
                                    onChange={(event) => {
                                        setRoleFilter(
                                            event.target.value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    <option value="">
                                        All roles
                                    </option>

                                    {roles.map(
                                        (role) => (
                                            <option
                                                key={
                                                    role._id
                                                }
                                                value={
                                                    role._id
                                                }
                                            >
                                                {readableRole(
                                                    role.name
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(event) => {
                                        setStatusFilter(
                                            event.target.value
                                        );

                                        setPagination(
                                            (current) => ({
                                                ...current,
                                                page: 1,
                                            })
                                        );
                                    }}
                                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    <option value="">
                                        All status
                                    </option>

                                    {STATUS_OPTIONS.map(
                                        (status) => (
                                            <option
                                                key={
                                                    status
                                                }
                                                value={
                                                    status
                                                }
                                            >
                                                {readableRole(
                                                    status
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[950px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-left dark:border-slate-800 dark:bg-slate-950/40">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        User
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Role
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Verification
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Last Login
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <LoadingRows />
                                ) : users.length === 0 ? (
                                    <EmptyRow />
                                ) : (
                                    users.map(
                                        (user) => (
                                            <UserRow
                                                key={
                                                    user._id
                                                }
                                                user={
                                                    user
                                                }
                                                openMenu={
                                                    openMenu
                                                }
                                                setOpenMenu={
                                                    setOpenMenu
                                                }
                                                onEdit={
                                                    openEdit
                                                }
                                                onStatus={
                                                    changeStatus
                                                }
                                                onDelete={() =>
                                                    setDeleteTarget(
                                                        user
                                                    )
                                                }
                                                onRestore={
                                                    restoreUser
                                                }
                                                actionLoading={
                                                    actionLoading
                                                }
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-slate-200 lg:hidden dark:divide-slate-800">
                        {loading ? (
                            <div className="p-10 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-violet-600" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="px-5 py-14 text-center">
                                <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                                <p className="font-medium text-slate-700 dark:text-slate-200">
                                    No users found
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Try changing your
                                    search or filters.
                                </p>
                            </div>
                        ) : (
                            users.map(
                                (user) => (
                                    <MobileUserCard
                                        key={
                                            user._id
                                        }
                                        user={
                                            user
                                        }
                                        openMenu={
                                            openMenu
                                        }
                                        setOpenMenu={
                                            setOpenMenu
                                        }
                                        onEdit={
                                            openEdit
                                        }
                                        onStatus={
                                            changeStatus
                                        }
                                        onDelete={() =>
                                            setDeleteTarget(
                                                user
                                            )
                                        }
                                        onRestore={
                                            restoreUser
                                        }
                                        actionLoading={
                                            actionLoading
                                        }
                                    />
                                )
                            )
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                {users.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                {pagination.total}
                            </span>{" "}
                            users
                        </p>

                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                            <button
                                type="button"
                                disabled={
                                    pagination.page <=
                                    1 ||
                                    loading
                                }
                                onClick={() =>
                                    changePage(
                                        pagination.page -
                                        1
                                    )
                                }
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            <span className="px-2 text-sm text-slate-500">
                                {pagination.page} /{" "}
                                {
                                    pagination.totalPages
                                }
                            </span>

                            <button
                                type="button"
                                disabled={
                                    pagination.page >=
                                    pagination.totalPages ||
                                    loading
                                }
                                onClick={() =>
                                    changePage(
                                        pagination.page +
                                        1
                                    )
                                }
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Create / Edit modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {editingUser
                                        ? "Edit User"
                                        : "Create User"}
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {editingUser
                                        ? "Update account information and access."
                                        : "Create a new ADM user account."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                submitUser
                            }
                            className="overflow-y-auto p-5"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="First Name"
                                    required
                                >
                                    <input
                                        value={
                                            form.firstName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "firstName",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                        placeholder="Anwar"
                                    />
                                </Field>

                                <Field label="Last Name">
                                    <input
                                        value={
                                            form.lastName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "lastName",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                        placeholder="Ulhaq"
                                    />
                                </Field>

                                <Field
                                    label="Email"
                                    required
                                >
                                    <input
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "email",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                        placeholder="user@adm.com"
                                    />
                                </Field>

                                {!editingUser && (
                                    <Field
                                        label="Password"
                                        required
                                    >
                                        <input
                                            type="password"
                                            value={
                                                form.password
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateForm(
                                                    "password",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="input"
                                            placeholder="••••••••"
                                        />
                                    </Field>
                                )}

                                <Field
                                    label="Role"
                                    required
                                >
                                    <select
                                        value={
                                            form.role
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "role",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="">
                                            Select role
                                        </option>

                                        {roles.map(
                                            (
                                                role
                                            ) => (
                                                <option
                                                    key={
                                                        role._id
                                                    }
                                                    value={
                                                        role._id
                                                    }
                                                >
                                                    {readableRole(
                                                        role.name
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>

                                <Field label="Status">
                                    <select
                                        value={
                                            form.status
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "status",
                                                event
                                                    .target
                                                    .value as UserStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        {STATUS_OPTIONS.map(
                                            (
                                                status
                                            ) => (
                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {readableRole(
                                                        status
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>

                                <Field label="Phone">
                                    <input
                                        value={
                                            form.phone
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "phone",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                        placeholder="+92..."
                                    />
                                </Field>

                                <Field label="Job Title">
                                    <input
                                        value={
                                            form.jobTitle
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateForm(
                                                "jobTitle",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                        placeholder="Senior Developer"
                                    />
                                </Field>

                                <div className="sm:col-span-2">
                                    <Field label="Avatar URL">
                                        <input
                                            value={
                                                form.avatar
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateForm(
                                                    "avatar",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="input"
                                            placeholder="https://..."
                                        />
                                    </Field>
                                </div>
                            </div>

                            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                <input
                                    type="checkbox"
                                    checked={
                                        form.isEmailVerified
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateForm(
                                            "isEmailVerified",
                                            event
                                                .target
                                                .checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                />

                                <span>
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Mark email as
                                        verified
                                    </span>

                                    <span className="block text-xs text-slate-400">
                                        Skip email
                                        verification for
                                        this account.
                                    </span>
                                </span>
                            </label>

                            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                >
                                    {actionLoading && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}

                                    {editingUser
                                        ? "Save Changes"
                                        : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Move user to trash?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            <strong className="text-slate-700 dark:text-slate-200">
                                {getUserName(
                                    deleteTarget
                                )}
                            </strong>{" "}
                            will no longer appear in
                            the active users list. You
                            can restore the account
                            later.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={
                                    actionLoading
                                }
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    actionLoading
                                }
                                onClick={
                                    deleteUser
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Move to Trash
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .input {
                    height: 2.75rem;
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid rgb(226 232 240);
                    background: white;
                    padding: 0 0.875rem;
                    font-size: 0.875rem;
                    color: rgb(15 23 42);
                    outline: none;
                    transition: all 150ms;
                }

                .input:focus {
                    border-color: rgb(139 92 246);
                    box-shadow: 0 0 0 4px
                        rgb(139 92 246 / 0.1);
                }

                .dark .input {
                    border-color: rgb(51 65 85);
                    background: rgb(15 23 42);
                    color: white;
                }

                .dark .input:focus {
                    border-color: rgb(139 92 246);
                }
            `}</style>
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                {icon}
            </div>

            <p className="text-xs font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {value.toLocaleString()}
            </p>
        </div>
    );
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
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

function UserRow({
    user,
    openMenu,
    setOpenMenu,
    onEdit,
    onStatus,
    onDelete,
    onRestore,
    actionLoading,
}: {
    user: User;
    openMenu: string | null;
    setOpenMenu: (
        value: string | null
    ) => void;
    onEdit: (user: User) => void;
    onStatus: (
        user: User,
        status: UserStatus
    ) => void;
    onDelete: () => void;
    onRestore: (user: User) => void;
    actionLoading: boolean;
}) {
    const isDeleted = Boolean(
        user.isDeleted
    );

    return (
        <tr className="border-b border-slate-100 last:border-0 dark:border-slate-800">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                            {initials(user)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {getUserName(
                                user
                            )}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user.email}
                        </p>

                        {user.jobTitle && (
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                {user.jobTitle}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleClasses(
                        user.role?.name
                    )}`}
                >
                    {readableRole(
                        user.role?.name
                    )}
                </span>
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        user.status
                    )}`}
                >
                    {readableRole(
                        user.status
                    )}
                </span>
            </td>

            <td className="px-5 py-4">
                {user.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified
                    </span>
                ) : (
                    <span className="text-xs font-medium text-slate-400">
                        Unverified
                    </span>
                )}
            </td>

            <td className="px-5 py-4 text-xs text-slate-500">
                {formatDate(
                    user.lastLogin
                )}
            </td>

            <td className="px-5 py-4 text-right">
                <div className="relative inline-block">
                    <button
                        type="button"
                        disabled={
                            actionLoading
                        }
                        onClick={() =>
                            setOpenMenu(
                                openMenu ===
                                    user._id
                                    ? null
                                    : user._id
                            )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {openMenu ===
                        user._id && (
                            <UserActions
                                user={user}
                                isDeleted={
                                    isDeleted
                                }
                                onEdit={
                                    onEdit
                                }
                                onStatus={
                                    onStatus
                                }
                                onDelete={
                                    onDelete
                                }
                                onRestore={
                                    onRestore
                                }
                            />
                        )}
                </div>
            </td>
        </tr>
    );
}

function MobileUserCard({
    user,
    openMenu,
    setOpenMenu,
    onEdit,
    onStatus,
    onDelete,
    onRestore,
    actionLoading,
}: {
    user: User;
    openMenu: string | null;
    setOpenMenu: (
        value: string | null
    ) => void;
    onEdit: (user: User) => void;
    onStatus: (
        user: User,
        status: UserStatus
    ) => void;
    onDelete: () => void;
    onRestore: (user: User) => void;
    actionLoading: boolean;
}) {
    return (
        <div className="p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                            {initials(user)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {getUserName(
                                user
                            )}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        type="button"
                        disabled={
                            actionLoading
                        }
                        onClick={() =>
                            setOpenMenu(
                                openMenu ===
                                    user._id
                                    ? null
                                    : user._id
                            )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {openMenu ===
                        user._id && (
                            <UserActions
                                user={user}
                                isDeleted={Boolean(
                                    user.isDeleted
                                )}
                                onEdit={
                                    onEdit
                                }
                                onStatus={
                                    onStatus
                                }
                                onDelete={
                                    onDelete
                                }
                                onRestore={
                                    onRestore
                                }
                            />
                        )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleClasses(
                        user.role?.name
                    )}`}
                >
                    {readableRole(
                        user.role?.name
                    )}
                </span>

                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        user.status
                    )}`}
                >
                    {readableRole(
                        user.status
                    )}
                </span>

                {user.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                    </span>
                )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Job Title
                    </p>

                    <p className="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                        {user.jobTitle ||
                            "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Last Login
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {formatDate(
                            user.lastLogin
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

function UserActions({
    user,
    isDeleted,
    onEdit,
    onStatus,
    onDelete,
    onRestore,
}: {
    user: User;
    isDeleted: boolean;
    onEdit: (user: User) => void;
    onStatus: (
        user: User,
        status: UserStatus
    ) => void;
    onDelete: () => void;
    onRestore: (user: User) => void;
}) {
    return (
        <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
            {!isDeleted && (
                <>
                    <button
                        type="button"
                        onClick={() =>
                            onEdit(user)
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Edit3 className="h-4 w-4" />
                        Edit user
                    </button>

                    {user.status ===
                        "active" ? (
                        <button
                            type="button"
                            onClick={() =>
                                onStatus(
                                    user,
                                    "inactive"
                                )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <Ban className="h-4 w-4" />
                            Deactivate
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                onStatus(
                                    user,
                                    "active"
                                )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        >
                            <UserCheck className="h-4 w-4" />
                            Activate
                        </button>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        <Trash2 className="h-4 w-4" />
                        Move to trash
                    </button>
                </>
            )}

            {isDeleted && (
                <button
                    type="button"
                    onClick={() =>
                        onRestore(user)
                    }
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Restore user
                </button>
            )}
        </div>
    );
}

function LoadingRows() {
    return (
        <>
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <tr key={index}>
                    <td
                        colSpan={6}
                        className="px-5 py-5"
                    >
                        <div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                    </td>
                </tr>
            ))}
        </>
    );
}

function EmptyRow() {
    return (
        <tr>
            <td
                colSpan={6}
                className="px-5 py-16 text-center"
            >
                <Users className="mx-auto mb-3 h-9 w-9 text-slate-300" />

                <p className="font-semibold text-slate-700 dark:text-slate-200">
                    No users found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                    Try changing your search
                    or filters.
                </p>
            </td>
        </tr>
    );
}