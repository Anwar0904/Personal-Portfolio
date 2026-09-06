"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { blogCategories } from "@/lib/dummy/blog";

export default function BlogFiltersSection() {
    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [selectedReading, setSelectedReading] =
        useState("All");

    const [selectedSort, setSelectedSort] =
        useState("Latest");

    const filters = useMemo(
        () => ["All", ...blogCategories],
        []
    );

    return (
        <section className="sticky top-20 z-30 bg-white/80 py-8 backdrop-blur-xl">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">

                    {/* Desktop */}

                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-5 p-6 lg:grid">
                        {/* Search */}

                        <div className="relative">
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={20}
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search articles..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm outline-none transition focus:border-blue-600 focus:bg-white"
                            />
                        </div>

                        {/* Category */}

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none transition focus:border-blue-600"
                        >
                            {filters.map((category) => (
                                <option key={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Reading */}

                        <select
                            value={selectedReading}
                            onChange={(e) =>
                                setSelectedReading(e.target.value)
                            }
                            className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none transition focus:border-blue-600"
                        >
                            <option>All</option>
                            <option>5 min</option>
                            <option>10 min</option>
                            <option>15+ min</option>
                        </select>

                        {/* Sort */}

                        <select
                            value={selectedSort}
                            onChange={(e) =>
                                setSelectedSort(e.target.value)
                            }
                            className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none transition focus:border-blue-600"
                        >
                            <option>Latest</option>
                            <option>Trending</option>
                            <option>Most Viewed</option>
                            <option>Editor&apos;s Pick</option>
                        </select>

                        <button className="flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-700">
                            Apply
                        </button>
                    </div>

                    {/* Mobile */}

                    <div className="space-y-5 p-5 lg:hidden">
                        <div className="relative">
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={20}
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search..."
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 outline-none"
                            />
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {filters.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-medium">
                                <SlidersHorizontal size={18} />
                                Filters
                            </button>

                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("All");
                                    setSelectedReading("All");
                                    setSelectedSort("Latest");
                                }}
                                className="flex items-center justify-center rounded-2xl border border-slate-200 px-5"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Active Filters */}

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-5">
                        {selectedCategory !== "All" && (
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                                {selectedCategory}
                            </span>
                        )}

                        {selectedReading !== "All" && (
                            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
                                {selectedReading}
                            </span>
                        )}

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
                            {selectedSort}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}