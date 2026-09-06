export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arazidigitalmedia.com";

export { profile } from "./profile";

export const publicRoutes = {
    home: "/",
    services: "/services",
    portfolio: "/portfolio",
    industries: "/industries",
    blogs: "/blogs",
    contact: "/contact",
    consultation: "/consultation",
    team: "/team",
    testimonials: "/testimonials",
    faqs: "/faqs",
    privacyPolicy: "/privacy-policy",
    terms: "/terms",
    cookies: "/cookies",
} as const;
