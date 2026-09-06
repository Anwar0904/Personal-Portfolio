import { Types } from "mongoose";

import { ApiError } from "@/lib/api/api-error";
import { CONTENT_STATUS, LEAD_SOURCE } from "@/enums";
import { Blog } from "@/models/blog.model";
import { Consultation } from "@/models/consultation.model";
import { FAQ } from "@/models/faq.model";
import { Industry } from "@/models/industry.model";
import { Page } from "@/models/page.model";
import { Portfolio } from "@/models/portfolio.model";
import { Service } from "@/models/service.model";
import { Settings } from "@/models/settings.model";
import { TeamMember } from "@/models/team-member.model";
import { Testimonial } from "@/models/testimonial.model";
import LeadService from "@/services/lead.service";

const publicFields =
    "-createdBy -updatedBy -isDeleted -deletedAt";

type Pagination = {
    page: number;
    limit: number;
    featured?: boolean;
    search?: string;
};

type PublicContactInput = {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    interestedServices: string[];
    message: string;
};

function pagination(page: number, limit: number, total: number) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

function contentFilter(query: Pagination) {
    const filter: Record<string, unknown> = {
        status: CONTENT_STATUS.PUBLISHED,
        isDeleted: false,
    };

    if (query.featured !== undefined) {
        filter.featured = query.featured;
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    return filter;
}

class PublicContentService {
    async getBlogs(query: Pagination & { category?: string; tag?: string }) {
        const filter = contentFilter(query);

        if (query.category) filter.category = new Types.ObjectId(query.category);
        if (query.tag) filter.tags = { $in: [new Types.ObjectId(query.tag)] };

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .select(publicFields)
                .populate("category", "name slug")
                .populate("tags", "name slug color")
                .populate("author", "name avatar")
                .populate("featuredImage")
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit),
            Blog.countDocuments(filter),
        ]);

        return { blogs, pagination: pagination(query.page, query.limit, total) };
    }

    async getBlogBySlug(slug: string) {
        const blog = await Blog.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false })
            .select(publicFields)
            .populate("category", "name slug")
            .populate("tags", "name slug color")
            .populate("author", "name avatar")
            .populate("featuredImage")
            .populate("gallery");

        if (!blog) throw new ApiError(404, "Blog not found.");

        await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
        blog.views += 1;
        return blog;
    }

    async getServices(query: Pagination) {
        const filter = contentFilter(query);
        const [services, total] = await Promise.all([
            Service.find(filter).select(publicFields).populate("featuredImage").sort({ sortOrder: 1, createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            Service.countDocuments(filter),
        ]);
        return { services, pagination: pagination(query.page, query.limit, total) };
    }

    async getServiceBySlug(slug: string) {
        const service = await Service.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false }).select(publicFields).populate("featuredImage").populate("gallery");
        if (!service) throw new ApiError(404, "Service not found.");
        return service;
    }

    async getIndustries(query: Pagination) {
        const filter = contentFilter(query);
        const [industries, total] = await Promise.all([
            Industry.find(filter).select(publicFields).populate("featuredImage").populate("services", "title slug").sort({ sortOrder: 1, createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            Industry.countDocuments(filter),
        ]);
        return { industries, pagination: pagination(query.page, query.limit, total) };
    }

    async getIndustryBySlug(slug: string) {
        const industry = await Industry.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false }).select(publicFields).populate("featuredImage").populate("gallery").populate("services", "title slug featured");
        if (!industry) throw new ApiError(404, "Industry not found.");
        return industry;
    }

    async getPortfolio(query: Pagination) {
        const filter = contentFilter(query);
        const [portfolio, total] = await Promise.all([
            Portfolio.find(filter).select(publicFields).populate("featuredImage").populate("services", "title slug").populate("industries", "title slug").sort({ sortOrder: 1, createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            Portfolio.countDocuments(filter),
        ]);
        return { portfolio, pagination: pagination(query.page, query.limit, total) };
    }

    async getPortfolioBySlug(slug: string) {
        const portfolio = await Portfolio.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false }).select(publicFields).populate("featuredImage").populate("gallery").populate("services", "title slug").populate("industries", "title slug");
        if (!portfolio) throw new ApiError(404, "Portfolio not found.");
        return portfolio;
    }

    async getTeamMembers(query: Pagination) {
        const filter = contentFilter(query);
        const [teamMembers, total] = await Promise.all([
            TeamMember.find(filter).select(publicFields).populate("avatar").sort({ sortOrder: 1, createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            TeamMember.countDocuments(filter),
        ]);
        return { teamMembers, pagination: pagination(query.page, query.limit, total) };
    }

    async getTeamMemberBySlug(slug: string) {
        const teamMember = await TeamMember.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false }).select(publicFields).populate("avatar").populate("gallery");
        if (!teamMember) throw new ApiError(404, "Team member not found.");
        return teamMember;
    }

    async getTestimonials(query: Pagination) {
        const filter = contentFilter(query);
        const [testimonials, total] = await Promise.all([
            Testimonial.find(filter).select(publicFields).populate("avatar").populate("service", "title slug").sort({ sortOrder: 1, createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            Testimonial.countDocuments(filter),
        ]);
        return { testimonials, pagination: pagination(query.page, query.limit, total) };
    }

    async getFAQs(query: Pick<Pagination, "page" | "limit">) {
        const filter = { status: CONTENT_STATUS.PUBLISHED, isDeleted: false };
        const [faqs, total] = await Promise.all([
            FAQ.find(filter).select(publicFields).sort({ sortOrder: 1, createdAt: 1 }).skip((query.page - 1) * query.limit).limit(query.limit),
            FAQ.countDocuments(filter),
        ]);
        return { faqs, pagination: pagination(query.page, query.limit, total) };
    }

    async getPageBySlug(slug: string) {
        const page = await Page.findOne({ slug, status: CONTENT_STATUS.PUBLISHED, isDeleted: false }).select(publicFields).populate("featuredImage");
        if (!page) throw new ApiError(404, "Page not found.");
        return page;
    }

    async getHomePage() {
        const [
            page,
            services,
            portfolio,
            industries,
            testimonials,
            teamMembers,
            blogs,
            settings,
        ] = await Promise.all([
            Page.findOne({
                isHomePage: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("featuredImage"),

            Service.find({
                featured: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("featuredImage")
                .sort({
                    sortOrder: 1,
                })
                .limit(6),

            Portfolio.find({
                featured: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("featuredImage")
                .sort({
                    sortOrder: 1,
                })
                .limit(6),

            Industry.find({
                featured: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("featuredImage")
                .sort({
                    sortOrder: 1,
                })
                .limit(6),

            Testimonial.find({
                featured: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("avatar")
                .sort({
                    sortOrder: 1,
                })
                .limit(6),

            TeamMember.find({
                featured: true,
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("avatar")
                .sort({
                    sortOrder: 1,
                })
                .limit(8),

            Blog.find({
                status: CONTENT_STATUS.PUBLISHED,
                isDeleted: false,
            })
                .select(publicFields)
                .populate("featuredImage")
                .sort({
                    publishedAt: -1,
                    createdAt: -1,
                })
                .limit(3),

            Settings.findOne({
                isDeleted: false,
            })
                .select(
                    "branding contact social seo features"
                )
                .populate(
                    "branding.logo branding.favicon"
                ),
        ]);

        return {
            page,
            services,
            portfolio,
            industries,
            testimonials,
            teamMembers,
            blogs,
            settings,
        };
    }

    async getSettings() {
        const settings = await Settings.findOne({ isDeleted: false })
            .select("branding contact social seo features")
            .populate("branding.logo branding.favicon");
        if (!settings) throw new ApiError(404, "Settings not found.");
        return settings;
    }

    async submitContact(data: PublicContactInput) {
        return LeadService.createLead({
            ...data,
            attachments: [],
            source: LEAD_SOURCE.WEBSITE,
            notes: [],
        });
    }

    async submitConsultation(data: {
        fullName: string; email: string; phone?: string; company?: string; website?: string;
        interestedServices: string[]; message: string; scheduledAt: Date; duration: number;
        meetingType: "google-meet" | "zoom" | "microsoft-teams" | "phone" | "in-person"; agenda?: string;
    }) {
        const settings = await this.getSettings();
        if (!settings.features.consultationEnabled) {
            throw new ApiError(403, "Consultation booking is currently unavailable.");
        }

        const lead = await this.submitContact(data);
        return Consultation.create({
            lead: lead._id,
            scheduledAt: data.scheduledAt,
            duration: data.duration,
            meetingType: data.meetingType,
            agenda: data.agenda ?? "",
            status: "scheduled",
            isDeleted: false,
            deletedAt: null,
        });
    }

}

const publicContentService = new PublicContentService();
export default publicContentService;
