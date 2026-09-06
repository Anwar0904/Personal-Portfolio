import {
    Code2,
    FolderKanban,
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
        title: "Expertise",
        href: "/services",
        mega: true,
        items: [
            {
                title: "Development work",
                description: "Explore the services and systems I build.",
                href: "/services",
                icon: Code2,
            },
        ],
    },

    {
        title: "Projects",
        href: "/portfolio",
        icon: FolderKanban,
    },

    {
        title: "Writing",
        href: "/blogs",
        icon: Newspaper,
    },

    {
        title: "Contact",
        href: "/contact",
        icon: Phone,
    },
];