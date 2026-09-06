import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: [
                    "/admin",
                    "/api",
                    "/auth",
                    "/checkout",
                    "/*.json$",
                    "/*?*",
                ],
            },
            {
                userAgent: "AdsBot-Google",
                allow: ["/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
