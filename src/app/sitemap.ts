import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import { CONTENT_STATUS } from "@/enums";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/industries`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/team`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/consultation`,
      changeFrequency: "yearly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faqs`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified: new Date(),
    },
  ];

  try {
    await connectDB();

    const blogsResult = await PublicContentService.getBlogs({
      page: 1,
      limit: 1000,
    });

    const blogRoutes: MetadataRoute.Sitemap = (blogsResult.blogs || [])
      .filter((blog: any) => blog.status === CONTENT_STATUS.PUBLISHED)
      .map((blog: any) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
      }));

    const servicesResult = await PublicContentService.getServices({
      page: 1,
      limit: 1000,
    });

    const serviceRoutes: MetadataRoute.Sitemap = (servicesResult.services || [])
      .filter((service: any) => service.status === CONTENT_STATUS.PUBLISHED)
      .map((service: any) => ({
        url: `${baseUrl}/services/${service.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: new Date(service.updatedAt || service.createdAt),
      }));

    const portfolioResult = await PublicContentService.getPortfolio({
      page: 1,
      limit: 1000,
    });

    const portfolioRoutes: MetadataRoute.Sitemap = (portfolioResult.portfolio || [])
      .filter((item: any) => item.status === CONTENT_STATUS.PUBLISHED)
      .map((item: any) => ({
        url: `${baseUrl}/portfolio/${item.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: new Date(item.updatedAt || item.createdAt),
      }));

    const industriesResult = await PublicContentService.getIndustries({
      page: 1,
      limit: 1000,
    });

    const industryRoutes: MetadataRoute.Sitemap = (industriesResult.industries || [])
      .filter((industry: any) => industry.status === CONTENT_STATUS.PUBLISHED)
      .map((industry: any) => ({
        url: `${baseUrl}/industries/${industry.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: new Date(industry.updatedAt || industry.createdAt),
      }));

    return [
      ...staticRoutes,
      ...blogRoutes,
      ...serviceRoutes,
      ...portfolioRoutes,
      ...industryRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
