import { ContentStatus } from "@/enums";

export interface DashboardCard {
    title: string;

    value: number;

    icon?: string;
}

export interface DashboardContentStat {
    status: ContentStatus;

    count: number;
}

export interface DashboardRecentLead {
    _id: string;

    fullName: string;

    email: string;

    status: string;

    createdAt: Date;
}

export interface DashboardRecentBlog {
    _id: string;

    title: string;

    slug: string;

    createdAt: Date;
}

export interface DashboardData {
    cards: {
        users: DashboardCard;

        blogs: DashboardCard;

        services: DashboardCard;

        leads: DashboardCard;

        pages: DashboardCard;

        testimonials: DashboardCard;

        teamMembers: DashboardCard;

        media: DashboardCard;
    };

    contentStatus: DashboardContentStat[];

    recentBlogs: DashboardRecentBlog[];

    recentLeads: DashboardRecentLead[];
}