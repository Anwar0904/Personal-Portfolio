// src/components/portfolio/PortfolioFilter.tsx

"use client";

import { useMemo, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Web Applications",
  "AI & Intelligent Systems",
  "SaaS Platforms",
  "E-Commerce",
  "Mobile Apps",
  "Enterprise",
];

const industries = [
  "All Industries",
  "Healthcare",
  "Education",
  "Finance",
  "Real Estate",
  "Retail",
  "Government",
];

const technologies = [
  "Next.js",
  "React",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "AI",
  "Python",
  "AWS",
];

export default function PortfolioFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [industry, setIndustry] = useState("All Industries");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const activeFilters = useMemo(() => {
    let count = 0;

    if (category !== "All") count++;
    if (industry !== "All Industries") count++;
    count += selectedTech.length;

    return count;
  }, [category, industry, selectedTech]);

  const toggleTechnology = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((item) => item !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setIndustry("All Industries");
    setSelectedTech([]);
  };

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/70 shadow-[0_20px_80px_rgba(2,6,23,0.6)]">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#0b1627_0%,#0f2340_35%,#081827_100%)] p-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Discover Projects
                </p>

                <h2 className="text-3xl font-bold md:text-4xl">Filter Our Portfolio</h2>

                <p className="mt-3 max-w-2xl text-blue-100">
                  Browse our work by technology, industry, or solution type.
                  Instantly find projects relevant to your business.
                </p>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/15"
                >
                  <X className="h-4 w-4" />
                  Clear Filters ({activeFilters})
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-white/10 p-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, industries, technologies..."
                className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-14 pr-6 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-slate-950"
              />
            </div>
          </div>

          <div className="grid gap-10 p-8 lg:grid-cols-2">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-300" />
                <h3 className="font-semibold text-white">Project Category</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
                      category === item
                        ? "border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                        : "border-white/10 bg-slate-950/50 text-slate-200 hover:border-blue-300 hover:bg-slate-800"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-300" />
                <h3 className="font-semibold text-white">Industry</h3>
              </div>

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 text-white outline-none transition focus:border-blue-400"
              >
                {industries.map((item) => (
                  <option key={item} className="bg-slate-900 text-white">{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/40 p-8">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
              <p className="mt-2 text-sm text-slate-400">Select one or multiple technologies.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechnology(tech)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                    selectedTech.includes(tech)
                      ? "border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "border-white/10 bg-slate-900/80 text-slate-200 hover:border-blue-300 hover:bg-slate-800"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}