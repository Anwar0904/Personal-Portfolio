"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string | { _id?: string; url?: string };
  category?: string | { name?: string; title?: string };
  publishedAt?: string;
  createdAt?: string;
};

function getImageUrl(image: Blog["featuredImage"]): string {
  if (!image) {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80";
  }

  if (typeof image === "string") {
    return image;
  }

  return image.url ?? "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80";
}

function getCategory(category: Blog["category"]): string {
  if (!category) return "Insights";

  if (typeof category === "string") {
    return category;
  }

  return category.name ?? category.title ?? "Insights";
}

function formatDate(date?: string) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function LatestBlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/public/blogs?page=1&limit=3", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message ?? "Unable to load latest blogs.");
        }

        const data = result?.data;

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
            ? data.blogs
            : Array.isArray(data?.posts)
              ? data.posts
              : Array.isArray(data?.items)
                ? data.items
                : [];

        if (mounted) {
          setBlogs(items.slice(0, 3));
        }
      } catch (cause) {
        if (mounted) {
          setError(cause instanceof Error ? cause.message : "Unable to load latest blogs.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section-shell bg-slate-950/80">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-14 md:mb-16 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">Latest Insights</span>

            <h2 className="section-title mt-2 sm:mt-4">Insights & Resources</h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-2 sm:text-base sm:leading-7 md:text-lg md:leading-8">
              Stay updated with technology trends, AI innovations,
              software engineering and digital transformation.
            </p>
          </div>

          <Link
            href="/blogs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-200 sm:w-fit sm:gap-3 sm:rounded-xl sm:px-6 sm:py-3 md:text-base"
          >
            View All Articles
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {loading && (
          <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              Loading latest articles...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="text-sm font-medium text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center">
            <h3 className="text-xl font-bold text-white">No articles available yet</h3>
            <p className="mt-2 text-sm text-slate-300">Check back soon for the latest insights from ADM.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-6 sm:gap-7 lg:grid-cols-3">
            {blogs.map((blog) => {
              const image = getImageUrl(blog.featuredImage);
              const category = getCategory(blog.category);
              const date = formatDate(blog.publishedAt ?? blog.createdAt);

              return (
                <article
                  key={blog._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_18px_45px_rgba(2,6,23,0.5)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_22px_55px_rgba(37,99,235,0.16)]"
                >
                  <Link href={`/blogs/${blog.slug}`} className="block">
                    <div className="relative h-44 overflow-hidden sm:h-48 lg:h-52">
                      <Image
                        src={image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col space-y-4 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-200 sm:px-3 sm:text-xs">
                        {category}
                      </span>

                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {date}
                      </span>
                    </div>

                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-blue-300 sm:text-xl">
                        {blog.title}
                      </h3>
                    </Link>

                    {blog.excerpt && (
                      <p className="line-clamp-3 text-sm leading-6 text-slate-300 sm:text-[15px]">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-1">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-all group-hover:gap-3 sm:text-sm"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}