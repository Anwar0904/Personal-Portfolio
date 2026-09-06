import type { Author, BlogPost, TableOfContentsItem } from "@/lib/dummy/blog";

type PopulatedValue = {
    _id?: string | { toString(): string };
    id?: string | { toString(): string };
    name?: string;
    slug?: string;
    url?: string;
    path?: string;
    avatar?: string;
    role?: string;
    bio?: string;
};

function toPlainString(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value && typeof value === "object") {
        const documentValue = value as { toString?: () => string };
        if (typeof documentValue.toString === "function") {
            const result = documentValue.toString();
            if (result && result !== "[object Object]") return result;
        }
    }
    return "";
}

export type ApiBlog = {
    _id?: string;
    id?: string;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    featuredImage?: PopulatedValue | string | null;
    category?: PopulatedValue | string | null;
    tags?: Array<PopulatedValue | string>;
    author?: PopulatedValue | string | null;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
    featured?: boolean;
    readingTime?: number;
    publishedAt?: string | Date | null;
    updatedAt?: string | Date | null;
    views?: number;
    status?: "draft" | "published";
};

function valueId(value: PopulatedValue | string | null | undefined) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
        return toPlainString((value as PopulatedValue)._id ?? (value as PopulatedValue).id ?? "");
    }
    return "";
}

function valueName(value: PopulatedValue | string | null | undefined, fallback: string) {
    if (typeof value === "string") return value;
    return value?.name ?? fallback;
}

function imageUrl(value: PopulatedValue | string | null | undefined) {
    if (typeof value === "string") return value;
    return value?.url ?? value?.path ?? "https://images.unsplash.com/photo-1499756823156-0c0c9d8c2c5a?w=1600&q=80";
}

function headings(content: string): TableOfContentsItem[] {
    return content
        .split("\n")
        .filter((line) => /^#{1,2}\s+/.test(line))
        .map((line) => {
            const title = line.replace(/^#{1,2}\s+/, "").trim();
            return {
                id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                title,
            };
        });
}

export function normalizeBlog(input: ApiBlog): BlogPost {
    const content = input.content ?? "";
    const authorValue = input.author;
    const author: Author = {
        id: valueId(authorValue),
        name: valueName(authorValue, "ADM Team"),
        role: typeof authorValue === "object" ? authorValue?.role ?? "ADM Contributor" : "ADM Contributor",
        avatar: typeof authorValue === "object" ? authorValue?.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio: typeof authorValue === "object" ? authorValue?.bio ?? "ADM team member sharing practical technology insights." : "ADM team member sharing practical technology insights.",
    };

    const category = valueName(input.category, "Uncategorized");
    const tags = (input.tags ?? []).map((tag) => valueName(tag, "Tag"));
    const image = imageUrl(input.featuredImage);
    const publishedAt = input.publishedAt ? new Date(input.publishedAt).toISOString() : new Date().toISOString();

    return {
        id: toPlainString(input._id ?? input.id ?? input.slug),
        slug: input.slug,
        title: input.title,
        seoTitle: input.seo?.metaTitle ?? input.title,
        excerpt: input.excerpt ?? "",
        metaDescription: input.seo?.metaDescription ?? input.excerpt ?? "",
        content,
        featuredImage: image,
        coverImage: image,
        featured: input.featured ?? false,
        trending: false,
        category: category as BlogPost["category"],
        tags,
        tableOfContents: headings(content),
        readingTime: input.readingTime ?? 1,
        publishedAt,
        updatedAt: input.updatedAt ? new Date(input.updatedAt).toISOString() : publishedAt,
        author,
        views: input.views ?? 0,
        likes: 0,
        shares: 0,
        commentsCount: 0,
        status: input.status ?? "published",
    };
}

export async function fetchPublicBlogs(params = "") {
    const response = await fetch(`/api/public/blogs${params ? `?${params}` : ""}`);
    if (!response.ok) throw new Error("Unable to load blogs.");
    const body = await response.json() as { data?: { blogs?: ApiBlog[] } };
    return (body.data?.blogs ?? []).map(normalizeBlog);
}

export async function fetchPublicBlog(slug: string) {
    const response = await fetch(`/api/public/blogs/${encodeURIComponent(slug)}`);
    if (!response.ok) return null;
    const body = await response.json() as { data?: ApiBlog };
    return body.data ? normalizeBlog(body.data) : null;
}
