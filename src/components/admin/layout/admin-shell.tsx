"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
    BarChart3,
    Bell,
    BookOpen,
    BriefcaseBusiness,
    ChevronDown,
    FileText,
    FolderKanban,
    ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareQuote,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ShieldCheck,
    Tags,
    Users,
    X,
} from "lucide-react";

const navigation = [
    {
        label: "Overview",
        items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
    },
    {
        label: "Content",
        items: [
            { label: "Media", href: "/admin/media", icon: ImageIcon },
            { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
            { label: "Categories", href: "/admin/categories", icon: FolderKanban },
            { label: "Tags", href: "/admin/tags", icon: Tags },
            { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
            { label: "Portfolio", href: "/admin/portfolio", icon: BarChart3 },
            { label: "Team", href: "/admin/team", icon: Users },
            { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
            { label: "FAQs", href: "/admin/faqs", icon: FileText },
        ],
    },
    {
        label: "Business",
        items: [{ label: "Consultations", href: "/admin/consultations", icon: BriefcaseBusiness }],
    },
    {
        label: "Administration",
        items: [
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Roles", href: "/admin/roles", icon: ShieldCheck },
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

function getUser() {
    if (typeof window === "undefined") return null;

    try {
        const raw = sessionStorage.getItem("adm_user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            sessionStorage.removeItem("adm_user");
            router.replace("/admin/login");
            router.refresh();
        }
    }

    const pageTitle =
        navigation
            .flatMap((section) => section.items)
            .find(
                (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
            )?.label ?? "Admin";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {sidebarOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950/95 transition-all duration-300",
                    collapsed ? "w-[84px]" : "w-[270px]",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div
                    className={[
                        "flex h-20 items-center border-b border-slate-800",
                        collapsed ? "justify-center px-3" : "justify-between px-5",
                    ].join(" ")}
                >
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/30">
                            A
                        </span>

                        {!collapsed && (
                            <div>
                                <span className="block font-black tracking-tight text-white">ADM</span>
                                <span className="block text-[10px] font-medium text-slate-400">
                                    CONTROL CENTER
                                </span>
                            </div>
                        )}
                    </Link>

                    {!collapsed && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    {navigation.map((section) => (
                        <div key={section.label} className="mb-6">
                            {!collapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                    {section.label}
                                </p>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active =
                                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={[
                                                "group flex items-center rounded-xl py-3 text-sm font-semibold transition-all",
                                                collapsed ? "justify-center px-3" : "gap-3 px-3",
                                                active
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                            ].join(" ")}
                                        >
                                            <Icon
                                                size={19}
                                                className={
                                                    active
                                                        ? "text-white"
                                                        : "text-slate-400 group-hover:text-blue-400"
                                                }
                                            />

                                            {!collapsed && <span>{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="hidden border-t border-slate-800 p-3 lg:block">
                    <button
                        onClick={() => setCollapsed((value) => !value)}
                        className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={19} />
                        ) : (
                            <>
                                <PanelLeftClose size={19} />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>

                {!collapsed && (
                    <div className="border-t border-slate-800 p-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 font-bold text-blue-300">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-white">
                                    {user?.name || "Administrator"}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    {user?.email || "Admin account"}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                title="Sign out"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                            >
                                <LogOut size={17} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            <div
                className={[
                    "min-h-screen transition-all duration-300",
                    collapsed ? "lg:pl-[84px]" : "lg:pl-[270px]",
                ].join(" ")}
            >
                <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
                    <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl p-2.5 text-slate-300 hover:bg-slate-800 lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <Menu size={21} />
                            </button>

                            <div className="min-w-0">
                                <p className="hidden text-xs font-medium text-slate-400 sm:block">ADM Admin</p>
                                <h1 className="truncate text-xl font-black text-white">{pageTitle}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                className="relative rounded-xl p-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
                            </button>

                            <div className="hidden h-8 w-px bg-slate-700 sm:block" />

                            <button className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300">
                                    {user?.name?.charAt(0).toUpperCase() || "A"}
                                </span>
                                <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 sm:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
