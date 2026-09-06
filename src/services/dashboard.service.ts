import { DashboardData } from "@/types/dashboard.types";

import { User } from "@/models/user.model";
import { Blog } from "@/models/blog.model";
import { Service } from "@/models/service.model";
import { Lead } from "@/models/lead.model";
import { Page } from "@/models/page.model";
import { Testimonial } from "@/models/testimonial.model";
import { TeamMember } from "@/models/team-member.model";
import { Media } from "@/models/media.model";

import {
    CONTENT_STATUS,
} from "@/enums";

class DashboardService {
    async getDashboard(): Promise<DashboardData> {
        const [
            users,
            blogs,
            services,
            leads,
            pages,
            testimonials,
            teamMembers,
            media,

            draftCount,
            publishedCount,
            archivedCount,

            recentBlogs,
            recentLeads,
        ] = await Promise.all([
            User.countDocuments({
                isDeleted: false,
            }),

            Blog.countDocuments({
                isDeleted: false,
            }),

            Service.countDocuments({
                isDeleted: false,
            }),

            Lead.countDocuments({
                isDeleted: false,
            }),

            Page.countDocuments({
                isDeleted: false,
            }),

            Testimonial.countDocuments({
                isDeleted: false,
            }),

            TeamMember.countDocuments({
                isDeleted: false,
            }),

            Media.countDocuments({
                isDeleted: false,
            }),

            Blog.countDocuments({
                status:
                    CONTENT_STATUS.DRAFT,
                isDeleted: false,
            }),

            Blog.countDocuments({
                status:
                    CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            }),

            Blog.countDocuments({
                status:
                    CONTENT_STATUS.ARCHIVED,
                isDeleted: false,
            }),

            Blog.find({
                isDeleted: false,
            })
                .select(
                    "_id title slug createdAt"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(5)
                .lean(),

            Lead.find({
                isDeleted: false,
            })
                .select(
                    "_id fullName email status createdAt"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(5)
                .lean(),
        ]);

        return {
            cards: {
                users: {
                    title: "Users",
                    value: users,
                },

                blogs: {
                    title: "Blogs",
                    value: blogs,
                },

                services: {
                    title: "Services",
                    value: services,
                },

                leads: {
                    title: "Leads",
                    value: leads,
                },

                pages: {
                    title: "Pages",
                    value: pages,
                },

                testimonials: {
                    title:
                        "Testimonials",
                    value:
                        testimonials,
                },

                teamMembers: {
                    title:
                        "Team Members",
                    value:
                        teamMembers,
                },

                media: {
                    title: "Media",
                    value: media,
                },
            },

            contentStatus: [
                {
                    status:
                        CONTENT_STATUS.DRAFT,
                    count: draftCount,
                },

                {
                    status:
                        CONTENT_STATUS.PUBLISHED,
                    count:
                        publishedCount,
                },

                {
                    status:
                        CONTENT_STATUS.ARCHIVED,
                    count:
                        archivedCount,
                },
            ],

            recentBlogs:
                recentBlogs.map(
                    (blog) => ({
                        _id: blog._id.toString(),
                        title:
                            blog.title,
                        slug: blog.slug,
                        createdAt:
                            blog.createdAt,
                    })
                ),

            recentLeads:
                recentLeads.map(
                    (lead) => ({
                        _id: lead._id.toString(),
                        fullName:
                            lead.fullName,
                        email:
                            lead.email,
                        status:
                            lead.status,
                        createdAt:
                            lead.createdAt,
                    })
                ),
        };
    }
}

export default new DashboardService();