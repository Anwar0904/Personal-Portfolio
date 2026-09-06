// src/lib/dummy/blog.ts

export type BlogCategory =
    | "Artificial Intelligence"
    | "Web Development"
    | "Next.js"
    | "UI / UX"
    | "Cloud"
    | "DevOps"
    | "Blockchain"
    | "Digital Marketing"
    | "Case Studies"
    | "Company News";

export type BlogStatus =
    | "draft"
    | "published";

export interface Author {
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
    linkedin?: string;
    twitter?: string;
}

export interface TableOfContentsItem {
    id: string;
    title: string;
}

export interface BlogPost {
    id: string;

    slug: string;

    title: string;

    seoTitle: string;

    excerpt: string;

    metaDescription: string;

    content: string;

    featuredImage: string;
    coverImage: string;

    featured: boolean;

    featuredOrder?: number;

    trending: boolean;

    category: BlogCategory;

    tags: string[];

    tableOfContents: TableOfContentsItem[];

    readingTime: number;

    publishedAt: string;

    updatedAt: string;

    author: Author;

    views: number;

    likes: number;

    shares: number;

    commentsCount: number;

    status: BlogStatus;
}

export const blogCategories: BlogCategory[] = [
    "Artificial Intelligence",
    "Web Development",
    "Next.js",
    "UI / UX",
    "Cloud",
    "DevOps",
    "Blockchain",
    "Digital Marketing",
    "Case Studies",
    "Company News",
];

export const blogAuthors: Author[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        role: "AI Research Lead",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio: "Sarah specializes in enterprise AI systems, LLM integrations, and intelligent automation.",
        linkedin: "#",
        twitter: "#",
    },
    {
        id: "2",
        name: "Michael Chen",
        role: "Senior Full Stack Engineer",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        bio: "Michael builds scalable web applications using Next.js, Node.js and cloud-native technologies.",
        linkedin: "#",
        twitter: "#",
    },
    {
        id: "3",
        name: "Emma Wilson",
        role: "UI / UX Director",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        bio: "Emma designs premium digital experiences focused on usability, accessibility and conversion.",
        linkedin: "#",
        twitter: "#",
    },
    {
        id: "4",
        name: "David Miller",
        role: "Cloud Architect",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        bio: "David architects secure cloud platforms and DevOps pipelines for enterprise applications.",
        linkedin: "#",
        twitter: "#",
    },
];

const demoContent = `# Introduction

Modern software products demand speed, scalability and exceptional user experience.

## Why This Matters

Today's businesses need digital solutions that grow with their customers while maintaining performance.

## Planning

Every successful project starts with understanding business goals, defining requirements and creating a realistic roadmap.

## Architecture

Choosing the right technology stack directly impacts scalability, maintainability and development speed.

## Development

High-quality engineering practices, testing and continuous deployment ensure reliable software delivery.

## Best Practices

- Build for scalability.
- Prioritize user experience.
- Automate deployments.
- Measure performance continuously.

## Conclusion

Technology alone doesn't build successful products—strategy, execution and continuous improvement do.
`;

export const blogPosts: BlogPost[] = [
    {
        id: "1",

        slug: "building-enterprise-ai-applications",

        title:
            "Building Enterprise AI Applications in 2026",

        seoTitle:
            "Building Enterprise AI Applications in 2026 | ADM",

        excerpt:
            "Discover the architecture, tools and best practices behind scalable enterprise AI systems.",

        metaDescription:
            "Learn how enterprise AI applications are designed, deployed and scaled using modern technologies and LLMs.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",

        featured: true,

        featuredOrder: 1,

        trending: true,

        category:
            "Artificial Intelligence",

        tags: [
            "AI",
            "LLMs",
            "Enterprise",
            "Automation",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "why-this-matters",
                title: "Why This Matters",
            },
            {
                id: "planning",
                title: "Planning",
            },
            {
                id: "architecture",
                title: "Architecture",
            },
            {
                id: "development",
                title: "Development",
            },
            {
                id: "best-practices",
                title: "Best Practices",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 8,

        publishedAt: "2026-07-25",

        updatedAt: "2026-07-29",

        author: blogAuthors[0],

        views: 8250,

        likes: 721,

        shares: 180,

        commentsCount: 34,

        status: "published",
    },

    {
        id: "2",

        slug: "nextjs-best-practices",

        title:
            "Next.js 16 Best Practices Every Developer Should Know",

        seoTitle:
            "Next.js 16 Best Practices | ADM",

        excerpt:
            "Performance optimization, routing strategy and production deployment tips.",

        metaDescription:
            "Master Next.js 16 with production-ready architecture, routing and performance optimization.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",

        featured: false,

        trending: true,

        category: "Next.js",

        tags: [
            "Next.js",
            "SSR",
            "Performance",
            "React",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "routing",
                title: "Routing",
            },
            {
                id: "performance",
                title: "Performance",
            },
            {
                id: "deployment",
                title: "Deployment",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 6,

        publishedAt: "2026-07-20",

        updatedAt: "2026-07-22",

        author: blogAuthors[1],

        views: 6400,

        likes: 501,

        shares: 122,

        commentsCount: 27,

        status: "published",
    },

    {
        id: "3",

        slug:
            "modern-ui-design-principles",

        title:
            "Modern UI Design Principles That Increase Conversion",

        seoTitle:
            "Modern UI Design Principles | ADM",

        excerpt:
            "Learn how premium interfaces improve usability and business growth.",

        metaDescription:
            "Discover UI and UX principles that improve conversions and user satisfaction.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",

        featured: false,

        trending: false,

        category: "UI / UX",

        tags: [
            "UI",
            "UX",
            "Design",
            "Figma",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "research",
                title: "Research",
            },
            {
                id: "design-system",
                title: "Design System",
            },
            {
                id: "accessibility",
                title: "Accessibility",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 7,

        publishedAt: "2026-07-15",

        updatedAt: "2026-07-18",

        author: blogAuthors[2],

        views: 4100,

        likes: 380,

        shares: 91,

        commentsCount: 18,

        status: "published",
    },

    {
        id: "4",

        slug:
            "future-of-cloud-native-development",

        title:
            "Cloud Native Development: The Future of Scalable Software",

        seoTitle:
            "Cloud Native Development | ADM",

        excerpt:
            "Containers, Kubernetes and cloud infrastructure explained in a practical way.",

        metaDescription:
            "Explore cloud-native architecture, Kubernetes and scalable software engineering.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",

        featured: false,

        trending: false,

        category: "Cloud",

        tags: [
            "Cloud",
            "Docker",
            "Kubernetes",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "containers",
                title: "Containers",
            },
            {
                id: "kubernetes",
                title: "Kubernetes",
            },
            {
                id: "deployment",
                title: "Deployment",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 9,

        publishedAt: "2026-07-10",

        updatedAt: "2026-07-11",

        author: blogAuthors[3],

        views: 3200,

        likes: 240,

        shares: 74,

        commentsCount: 13,

        status: "published",
    },

    {
        id: "5",

        slug:
            "how-adm-builds-digital-products",

        title:
            "Inside ADM: How We Deliver Premium Digital Products",

        seoTitle:
            "How ADM Builds Digital Products | ADM",

        excerpt:
            "A behind-the-scenes look into our design and engineering workflow.",

        metaDescription:
            "Learn how ADM designs, develops and delivers modern digital products.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",

        featured: false,

        trending: false,

        category:
            "Company News",

        tags: [
            "ADM",
            "Culture",
            "Workflow",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "culture",
                title: "Culture",
            },
            {
                id: "workflow",
                title: "Workflow",
            },
            {
                id: "delivery",
                title: "Delivery",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 5,

        publishedAt: "2026-07-05",

        updatedAt: "2026-07-06",

        author: blogAuthors[1],

        views: 1800,

        likes: 170,

        shares: 39,

        commentsCount: 9,

        status: "published",
    },

    {
        id: "6",

        slug:
            "smart-blockchain-solutions",

        title:
            "Smart Blockchain Solutions Beyond Cryptocurrency",

        seoTitle:
            "Blockchain Solutions for Business | ADM",

        excerpt:
            "Explore real-world blockchain use cases for enterprises and startups.",

        metaDescription:
            "Learn how blockchain technology creates value beyond cryptocurrencies.",

        content: demoContent,

        featuredImage:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
        coverImage:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",

        featured: false,

        trending: false,

        category:
            "Blockchain",

        tags: [
            "Blockchain",
            "Web3",
            "Solidity",
        ],

        tableOfContents: [
            {
                id: "introduction",
                title: "Introduction",
            },
            {
                id: "business-usecases",
                title: "Business Use Cases",
            },
            {
                id: "security",
                title: "Security",
            },
            {
                id: "future",
                title: "Future",
            },
            {
                id: "conclusion",
                title: "Conclusion",
            },
        ],

        readingTime: 10,

        publishedAt: "2026-06-30",

        updatedAt: "2026-07-01",

        author: blogAuthors[0],

        views: 3900,

        likes: 311,

        shares: 85,

        commentsCount: 17,

        status: "published",
    },
];

export function getBlogs() {
    return blogPosts.filter(
        (blog) => blog.status === "published"
    );
}

export function getBlogBySlug(
    slug: string
) {
    return blogPosts.find(
        (blog) =>
            blog.slug === slug &&
            blog.status === "published"
    );
}

export function getRelatedBlogs(
    slug: string,
    limit = 3
) {
    const current = getBlogBySlug(slug);

    if (!current) return [];

    return blogPosts
        .filter(
            (blog) =>
                blog.slug !== slug &&
                blog.status === "published" &&
                (blog.category === current.category ||
                    blog.tags.some((tag) =>
                        current.tags.includes(tag)
                    ))
        )
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
}

export function getFeaturedBlogs() {
    return blogPosts
        .filter(
            (blog) =>
                blog.featured &&
                blog.status === "published"
        )
        .sort(
            (a, b) =>
                (a.featuredOrder ?? 99) -
                (b.featuredOrder ?? 99)
        );
}

export function getTrendingBlogs() {
    return blogPosts
        .filter(
            (blog) =>
                blog.trending &&
                blog.status === "published"
        )
        .sort((a, b) => b.views - a.views);
}