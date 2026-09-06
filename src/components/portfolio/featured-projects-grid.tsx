// src/components/public/portfolio/featured-projects-grid.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "ADM CRM Platform",
    slug: "adm-crm-platform",
    category: "Enterprise Software",
    description:
      "AI-powered customer relationship platform with analytics, automation and intelligent workflows.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    featured: true,
    size: "large",
    tech: ["Next.js", "Node.js", "AI"],
  },
  {
    id: 2,
    title: "HealthCare AI",
    slug: "healthcare-ai",
    category: "Artificial Intelligence",
    description: "Medical assistant dashboard for hospitals.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1?w=1200&q=80",
    featured: true,
    size: "medium",
    tech: ["Python", "LLM"],
  },
  {
    id: 3,
    title: "Luxury Ecommerce",
    slug: "luxury-ecommerce",
    category: "E-Commerce",
    description: "Premium shopping experience with high conversions.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
    featured: false,
    size: "small",
    tech: ["Next.js", "Stripe"],
  },
  {
    id: 4,
    title: "Construction ERP",
    slug: "construction-erp",
    category: "Business Platform",
    description: "End-to-end management system.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    featured: false,
    size: "small",
    tech: ["React", "MongoDB"],
  },
  {
    id: 5,
    title: "Travel Booking Suite",
    slug: "travel-booking-suite",
    category: "Web Platform",
    description: "Complete booking ecosystem.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
    featured: false,
    size: "medium",
    tech: ["Next.js", "Maps"],
  },
];

export default function FeaturedProjectsGrid() {
  return (
    <section className="relative bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200">
            Featured Work
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
            Projects That Delivered
            <span className="block text-blue-400">Real Business Results</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Every project is engineered for performance, scalability,
            usability and measurable growth.
          </p>
        </div>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className={`
                group relative overflow-hidden rounded-3xl border border-white/10
                ${project.size === "large"
                  ? "md:col-span-2 md:row-span-2"
                  : project.size === "medium"
                    ? "xl:col-span-2"
                    : ""
                }
              `}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:bg-blue-600/15 group-hover:opacity-100" />

              <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-6">
                <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-100 backdrop-blur">
                  {project.category}
                </span>

                <div className="rounded-full bg-white/10 p-2 backdrop-blur transition group-hover:rotate-45 group-hover:bg-blue-500/30">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="absolute bottom-0 w-full p-6 md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-slate-900/40 px-3 py-1 text-xs text-slate-100 backdrop-blur"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <h3
                  className={`font-black text-white transition group-hover:text-blue-300 ${project.size === "large" ? "text-3xl" : "text-2xl"
                    }`}
                >
                  {project.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                  {project.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
                  View Case Study
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}