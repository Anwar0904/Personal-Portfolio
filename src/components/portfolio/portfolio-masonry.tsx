"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "ADM AI CRM Platform",
    slug: "adm-ai-crm",
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80",
    height: "h-[520px]",
  },
  {
    id: 2,
    title: "Medical Analytics Dashboard",
    slug: "medical-dashboard",
    category: "Healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80",
    height: "h-[320px]",
  },
  {
    id: 3,
    title: "Enterprise Banking Portal",
    slug: "banking-portal",
    category: "Finance",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900&q=80",
    height: "h-[440px]",
  },
  {
    id: 4,
    title: "E-Commerce Marketplace",
    slug: "marketplace",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=80",
    height: "h-[360px]",
  },
  {
    id: 5,
    title: "Smart Logistics Platform",
    slug: "logistics-platform",
    category: "Logistics",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80",
    height: "h-[560px]",
  },
  {
    id: 6,
    title: "Education LMS",
    slug: "education-lms",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80",
    height: "h-[380px]",
  },
];

export default function PortfolioMasonry() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-5">
        <div className="mb-14 max-w-3xl">
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200">
            Complete Portfolio
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
            Every Project Has A Story.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Explore real digital products, AI platforms, enterprise systems,
            SaaS applications and business solutions designed and developed by
            ADM.
          </p>
        </div>

        <div className="columns-1 gap-7 space-y-7 md:columns-2 xl:columns-3">
          {projects.map((project) => (
            <Link
              href={`/portfolio/${project.slug}`}
              key={project.id}
              className="group block break-inside-avoid"
            >
              <article
                className={`relative overflow-hidden rounded-3xl border border-white/10 ${project.height}`}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 backdrop-blur-sm transition duration-500 group-hover:opacity-100" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xl">
                    {project.category}
                  </span>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      <p className="mt-3 text-white/80">View complete case study</p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <button className="rounded-full bg-blue-600 px-10 py-4 font-semibold text-white transition hover:scale-105 hover:bg-blue-500">
            Load More Projects
          </button>
        </div>
      </div>
    </section>
  );
}