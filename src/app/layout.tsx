import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { SITE_URL } from "@/config/site";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: profile.seo.title,
        template: `%s | ${profile.name}`,
    },
    description: profile.seo.description,
    keywords: [...profile.seo.keywords],
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        title: profile.seo.title,
        description: profile.seo.description,
        siteName: profile.name,
    },
    twitter: {
        card: "summary_large_image",
        title: profile.seo.title,
        description: profile.seo.description,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <head>
                <link rel="canonical" href={SITE_URL} />
            </head>
            <body className="app-shell">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Person",
                                    name: profile.name,
                                    jobTitle: profile.title,
                                    url: SITE_URL,
                                    email: profile.email,
                                    sameAs: [profile.social.github, profile.social.linkedin],
                                },
                                {
                                    "@type": "WebSite",
                                    name: profile.name,
                                    url: SITE_URL,
                                    description: profile.seo.description,
                                },
                            ],
                        }),
                    }}
                />
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
                <Analytics />
            </body>
        </html>
    );
}