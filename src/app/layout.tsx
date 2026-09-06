import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "ADM | Digital Company - AI-Powered Web & Mobile Solutions",
        template: "%s | Arazi Digital Media",
    },
    description:
        "Arazi Digital Media (ADM) delivers intelligent digital solutions: AI automation, enterprise software, digital platforms, and UI/UX design. Trusted by leading brands for transforming businesses with technology.",
    keywords: [
        "digital agency",
        "digital company",
        "web development",
        "mobile apps",
        "AI solutions",
        "digital transformation",
        "UI/UX design",
        "enterprise software",
        "Pakistan",
    ],
    authors: [{ name: "Arazi Digital Media" }],
    creator: "Arazi Digital Media",
    publisher: "Arazi Digital Media",
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
        title: "ADM | Digital Company - AI-Powered Solutions",
        description:
            "Arazi Digital Media delivers intelligent digital solutions: AI automation, enterprise software, digital platforms, and UI/UX design.",
        siteName: "Arazi Digital Media",
    },
    twitter: {
        card: "summary_large_image",
        title: "ADM | Digital Company - AI-Powered Solutions",
        description:
            "Arazi Digital Media delivers intelligent digital solutions: AI automation, enterprise software, digital platforms, and UI/UX design.",
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
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
                <Analytics />
            </body>
        </html>
    );
}