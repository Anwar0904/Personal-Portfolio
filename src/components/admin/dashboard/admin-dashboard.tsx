import Link from "next/link";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    ImageIcon,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";

const quickActions = [
    {
        title: "Create Blog",
        description: "Publish a new article",
        href: "/admin/blogs/new",
        icon: FileText,
    },
    {
        title: "Add Project",
        description: "Update your portfolio",
        href: "/admin/portfolio/new",
        icon: ImageIcon,
    },
    {
        title: "View Consultations",
        description: "Manage client requests",
        href: "/admin/consultations",
        icon: BriefcaseBusiness,
    },
    {
        title: "Manage Team",
        description: "Update team members",
        href: "/admin/team",
        icon: Users,
    },
] as const;

interface DashboardStats {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    consultations: number;
    publishedBlogs: number;
    portfolioProjects: number;
}

type ActivityIcon = "users" | "briefcase" | "file";

interface RecentActivityItem {
    title: string;
    description: string;
    time: string;
    icon: ActivityIcon;
    status: string;
}

type ResourceName = "leads" | "consultations" | "blogs" | "portfolio";

type ResourceStatus = "operational" | "unavailable";

type ResourceHealth = Record<ResourceName, ResourceStatus>;

export interface AdminDashboardData {
    stats?: Partial<DashboardStats> | null;
    recentActivity?: RecentActivityItem[] | null;
    resourceHealth?: Partial<ResourceHealth> | null;
    error?: string | null;
}

const DEFAULT_STATS: DashboardStats = {
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    consultations: 0,
    publishedBlogs: 0,
    portfolioProjects: 0,
};

const DEFAULT_RESOURCE_HEALTH: ResourceHealth = {
    leads: "unavailable",
    consultations: "unavailable",
    blogs: "unavailable",
    portfolio: "unavailable",
};

export default function AdminDashboard({
    stats: incomingStats,
    recentActivity: incomingActivity,
    resourceHealth: incomingResourceHealth,
    error = null,
}: AdminDashboardData) {
    const stats: DashboardStats = {
        ...DEFAULT_STATS,
        ...(incomingStats ?? {}),
    };

    const recentActivity = Array.isArray(incomingActivity)
        ? incomingActivity
        : [];

    const resourceHealth: ResourceHealth = {
        ...DEFAULT_RESOURCE_HEALTH,
        ...(incomingResourceHealth ?? {}),
    };

    const conversionRate =
        stats.totalLeads > 0
            ? Math.round((stats.convertedLeads / stats.totalLeads) * 100)
            : 0;

    const resourceEntries = Object.entries(resourceHealth);

    const operationalCount = resourceEntries.filter(
        ([, status]) => status === "operational",
    ).length;

    const totalResources = resourceEntries.length;

    const allResourcesOperational =
        totalResources > 0 && operationalCount === totalResources;

    const someResourcesOperational = operationalCount > 0;

    const activityIcons = {
        users: Users,
        briefcase: BriefcaseBusiness,
        file: FileText,
    } as const;

    const statCards = [
        {
            label: "Total Leads",
            value: stats.totalLeads.toString(),
            icon: Users,
            href: "/admin/consultations",
        },
        {
            label: "Qualified",
            value: stats.qualifiedLeads.toString(),
            icon: BriefcaseBusiness,
            href: "/admin/consultations",
        },
        {
            label: "New Inquiries",
            value: stats.newLeads.toString(),
            icon: FileText,
            href: "/admin/leads",
        },
        {
            label: "Converted",
            value: stats.convertedLeads.toString(),
            icon: TrendingUp,
            href: "/admin/consultations",
        },
    ] as const;

    const systemStatus = [
        {
            name: "Website",
            status: "Operational",
            healthy: true,
        },
        {
            name: "Database",
            status:
                allResourcesOperational
                    ? "Operational"
                    : someResourcesOperational
                        ? "Partially available"
                        : "Unavailable",
            healthy: allResourcesOperational,
        },
        {
            name: "Authentication",
            status:
                error === null
                    ? "Observed"
                    : "Needs attention",
            healthy: error === null,
        },
        {
            name: "API Services",
            status:
                allResourcesOperational
                    ? "Operational"
                    : someResourcesOperational
                        ? "Partial outage"
                        : "Unavailable",
            healthy: allResourcesOperational,
        },
    ] as const;

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-400">
                        Overview
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Good morning, Admin.
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        Here&apos;s what&apos;s happening across your ADM
                        digital ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-sm">
                    <Clock3 size={17} />
                    <span>Today</span>
                </div>
            </section>

            {/* Error banner */}
            {error && (
                <section
                    role="alert"
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4"
                >
                    <div className="flex items-start gap-3">
                        <XCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div>
                            <p className="text-sm font-bold text-red-300">
                                Dashboard data is partially unavailable
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-200/80">
                                {error}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-950/30"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                                    <Icon size={21} />
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="text-slate-500 transition group-hover:text-blue-300"
                                />
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-medium text-slate-400">
                                    {stat.label}
                                </p>

                                <p className="mt-1 text-3xl font-black tracking-tight text-white">
                                    {stat.value}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </section>

            {/* Conversion + Quick Actions */}
            <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div>
                            <h2 className="font-black text-white">
                                Conversion Performance
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Overall lead-to-client progress
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                            <TrendingUp size={15} />
                            {conversionRate}%
                        </div>
                    </div>

                    <div className="grid gap-4 p-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Lead rate
                            </p>

                            <p className="mt-3 text-3xl font-black text-white">
                                {conversionRate}%
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Converted from total inquiries
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Qualified
                            </p>

                            <p className="mt-3 text-3xl font-black text-white">
                                {stats.qualifiedLeads}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                High-intent opportunities
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                Consultations
                            </p>

                            <p className="mt-3 text-3xl font-black text-white">
                                {stats.consultations}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Booked discovery calls
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div>
                        <h2 className="font-black text-white">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Frequently used actions
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/50 hover:bg-slate-950"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition group-hover:bg-blue-500/15 group-hover:text-blue-300">
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white">
                                            {action.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="text-slate-500 transition group-hover:text-blue-300"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Recent Activity + System Status */}
            <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div>
                            <h2 className="font-black text-white">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Latest changes across ADM
                            </p>
                        </div>

                        <Link
                            href="/admin/consultations"
                            className="text-sm font-bold text-blue-300 transition hover:text-blue-200"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {recentActivity.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">
                                No recent activity yet
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => {
                                const Icon =
                                    activityIcons[activity.icon] ?? FileText;

                                return (
                                    <div
                                        key={`${activity.title}-${activity.time}-${index}`}
                                        className="flex gap-4 p-5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                                            <Icon size={18} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-bold text-white">
                                                    {activity.title}
                                                </p>

                                                <span className="w-fit rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-300">
                                                    {activity.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {activity.description}
                                            </p>

                                            <p className="mt-2 text-xs font-medium text-slate-500">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div>
                        <h2 className="font-black text-white">
                            System Status
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            ADM services overview
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {systemStatus.map((service) => (
                            <div
                                key={service.name}
                                className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={[
                                            "h-2.5 w-2.5 rounded-full",
                                            service.healthy
                                                ? "bg-emerald-500"
                                                : "bg-amber-500",
                                        ].join(" ")}
                                    />

                                    <span className="text-sm font-semibold text-slate-200">
                                        {service.name}
                                    </span>
                                </div>

                                <div
                                    className={[
                                        "flex items-center gap-1.5 text-xs font-bold",
                                        service.healthy
                                            ? "text-emerald-400"
                                            : "text-amber-400",
                                    ].join(" ")}
                                >
                                    {service.healthy ? (
                                        <CheckCircle2 size={14} />
                                    ) : (
                                        <XCircle size={14} />
                                    )}

                                    {service.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                        <Eye
                            size={18}
                            className="shrink-0 text-blue-300"
                        />

                        <p className="text-xs leading-5 text-blue-200">
                            Dashboard information is generated from the
                            server-provided ADM data and reflects the health
                            information available to the dashboard.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}