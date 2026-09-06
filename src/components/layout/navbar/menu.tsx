import {
    Briefcase,
    Smartphone,
    BrainCircuit,
    Palette,
    FolderKanban,
    Building2,
    Users,
    Newspaper,
    Phone,
    LucideIcon,
} from "lucide-react";

export type NavigationChild = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

export type NavigationItem = {
    title: string;
    href: string;
    icon?: LucideIcon;
    mega?: boolean;
    items?: NavigationChild[];
};

export const navigation: NavigationItem[] = [
    {
        title: "Home",
        href: "/",
    },

    {
        title: "Capabilities",
        href: "/services",
        mega: true,
        items: [
            {
                title: "Digital Platforms & Engineering",
                description:
                    "Modern, scalable websites and web applications",
                href: "/services/web-development",
                icon: Briefcase,
            },
            {
                title: "Mobile Apps",
                description:
                    "High-quality Android and iOS applications",
                href: "/services/mobile-apps",
                icon: Smartphone,
            },
            {
                title: "AI & Intelligent Systems",
                description:
                    "AI-powered tools for modern businesses",
                href: "/services/ai-solutions",
                icon: BrainCircuit,
            },
            {
                title: "UI / UX Design",
                description:
                    "Beautiful and intuitive digital experiences",
                href: "/services/ui-ux",
                icon: Palette,
            },
        ],
    },

    {
        title: "Selected Work",
        href: "/portfolio",
        icon: FolderKanban,
    },

    {
        title: "Industries",
        href: "/industries",
        icon: Building2,
    },

    {
        title: "People & Expertise",
        href: "/team",
        icon: Users,
    },

    {
        title: "Insights",
        href: "/blogs",
        icon: Newspaper,
    },

    {
        title: "Talk to ADM",
        href: "/contact",
        icon: Phone,
    },
];