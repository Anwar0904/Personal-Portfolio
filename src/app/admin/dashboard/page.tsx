
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/admin/dashboard/admin-dashboard";
import { connectDB } from "@/lib/db";
import { getAccessToken } from "@/lib/auth/auth-cookies";
import { getUserFromToken } from "@/lib/auth/get-user";
import { AuthorizationService } from "@/lib/auth/authorization";
import { PERMISSIONS } from "@/constants/permissions";

import { Lead } from "@/models/lead.model";
import { Consultation } from "@/models/consultation.model";
import { Portfolio } from "@/models/portfolio.model";
import { Blog } from "@/models/blog.model";

export const dynamic = "force-dynamic";

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

type ResourceHealthStatus = "operational" | "unavailable";

interface ResourceHealth {
    leads: ResourceHealthStatus;
    consultations: ResourceHealthStatus;
    blogs: ResourceHealthStatus;
    portfolio: ResourceHealthStatus;
}

export default async function DashboardPage() {
    /*
     * ------------------------------------------------------------
     * 1. Authenticate
     * ------------------------------------------------------------
     */

    const accessToken = await getAccessToken();

    if (!accessToken) {
        redirect("/admin/login");
    }

    /*
     * ------------------------------------------------------------
     * 2. Connect to MongoDB
     * ------------------------------------------------------------
     */

    await connectDB();

    /*
     * ------------------------------------------------------------
     * 3. Resolve current user
     * ------------------------------------------------------------
     */

    const user = await getUserFromToken(`Bearer ${accessToken}`);

    if (!user) {
        redirect("/admin/login");
    }

    /*
     * ------------------------------------------------------------
     * 4. Validate role
     * ------------------------------------------------------------
     */

    const role = user.role;

    if (
        !role ||
        typeof role !== "object" ||
        !("name" in role) ||
        !("permissions" in role)
    ) {
        redirect("/admin/login");
    }

    /*
     * ------------------------------------------------------------
     * 5. Validate dashboard permission
     * ------------------------------------------------------------
     *
     * Super admins bypass the explicit permission check.
     * Other roles must have SETTINGS_MANAGE.
     */

    if (!AuthorizationService.isSuperAdmin(String(role.name))) {
        AuthorizationService.hasPermission(
            role.permissions as string[],
            PERMISSIONS.SETTINGS_MANAGE,
        );
    }

    /*
     * ------------------------------------------------------------
     * 6. Load all dashboard database data
     * ------------------------------------------------------------
     *
     * We intentionally avoid a separate DashboardService here.
     * The dashboard should use a predictable set of database
     * queries so a hidden service-layer exception cannot crash
     * the entire Server Component unexpectedly.
     */

    const [
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        consultations,
        publishedBlogs,
        portfolioProjects,
        recentLeads,
        recentBlogs,
    ] = await Promise.all([
        Lead.countDocuments({
            isDeleted: false,
        }),

        Lead.countDocuments({
            status: "new",
            isDeleted: false,
        }),

        Lead.countDocuments({
            status: {
                $in: [
                    "qualified",
                    "proposal_sent",
                    "converted",
                    "won",
                ],
            },
            isDeleted: false,
        }),

        Lead.countDocuments({
            status: {
                $in: ["converted", "won"],
            },
            isDeleted: false,
        }),

        Consultation.countDocuments({
            isDeleted: false,
        }),

        Blog.countDocuments({
            status: "published",
            isDeleted: false,
        }),

        Portfolio.countDocuments({
            status: "published",
            isDeleted: false,
        }),

        Lead.find({
            isDeleted: false,
        })
            .sort({ createdAt: -1 })
            .limit(2)
            .select("fullName status createdAt")
            .lean(),

        Blog.find({
            status: "published",
            isDeleted: false,
        })
            .sort({
                publishedAt: -1,
                createdAt: -1,
            })
            .limit(2)
            .select("title publishedAt createdAt")
            .lean(),
    ]);

    /*
     * ------------------------------------------------------------
     * 7. Build stats
     * ------------------------------------------------------------
     */

    const stats: DashboardStats = {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        consultations,
        publishedBlogs,
        portfolioProjects,
    };

    /*
     * ------------------------------------------------------------
     * 8. Build recent activity
     * ------------------------------------------------------------
     */

    const recentActivity: RecentActivityItem[] = [
        ...recentLeads.map((lead) => ({
            title: `New lead: ${lead.fullName ?? "Client"}`,
            description: "New inquiry received",
            time: getTimeAgo(lead.createdAt),
            icon: "users" as const,
            status: String(lead.status ?? "new"),
        })),

        ...recentBlogs.map((blog) => ({
            title: `Blog published: ${blog.title ?? "Untitled blog"}`,
            description: String(blog.title ?? "Published article"),
            time: getTimeAgo(
                blog.publishedAt ?? blog.createdAt,
            ),
            icon: "file" as const,
            status: "Published",
        })),
    ].slice(0, 4);

    /*
     * ------------------------------------------------------------
     * 9. Resource health
     * ------------------------------------------------------------
     *
     * Since all required queries completed successfully, these
     * dashboard resources were successfully observed from the
     * server during this render.
     */

    const resourceHealth: ResourceHealth = {
        leads: "operational",
        consultations: "operational",
        blogs: "operational",
        portfolio: "operational",
    };

    /*
     * ------------------------------------------------------------
     * 10. Render
     * ------------------------------------------------------------
     */

    return (
        <AdminDashboard
            stats={stats}
            recentActivity={recentActivity}
            resourceHealth={resourceHealth}
            error={null}
        />
    );
}

/*
 * ------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------
 */

function getTimeAgo(
    value: Date | string | null | undefined,
): string {
    if (!value) {
        return "Recently";
    }

    const timestamp = new Date(value).getTime();

    if (!Number.isFinite(timestamp)) {
        return "Recently";
    }

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000),
    );

    if (seconds < 60) {
        return "Just now";
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)} minutes ago`;
    }

    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} hours ago`;
    }

    if (seconds < 604800) {
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    return new Date(timestamp).toLocaleDateString();
}

