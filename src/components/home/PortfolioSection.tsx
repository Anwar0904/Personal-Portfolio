import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const portfolio = [
  {
    title: "Healthcare AI Platform",
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
  },
  {
    title: "Modern Banking Dashboard",
    category: "Web Application",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  },
  {
    title: "Smart Logistics System",
    category: "Enterprise Software",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  },
];

export default function PortfolioSection() {
  return (
    <section className="section-shell light-panel">
      <div className="section-content">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-7 sm:mb-14 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="section-kicker">
              Portfolio
            </span>

            <h2 className="section-title max-w-3xl">
              Work That Creates Impact
            </h2>

            <p className="section-copy max-w-2xl">
              Every project represents our commitment to innovation,
              performance, and exceptional user experience.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md sm:w-fit sm:px-6 sm:py-4"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {/* Projects */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_20px_40px_rgba(2,6,23,0.35)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_22px_50px_rgba(37,99,235,0.18)] sm:rounded-3xl"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden sm:h-72 lg:h-80">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                  <span className="inline-flex max-w-full rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 sm:px-4">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-5 sm:space-y-5 sm:p-7 lg:p-8">
                <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                  {project.title}
                </h3>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-all group-hover:gap-3 sm:text-base"
                >
                  Explore Project
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}