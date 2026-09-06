import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
              Selected projects
            </h2>

            <p className="section-copy max-w-2xl">
              A closer look at the products and systems managed through the existing portfolio.
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

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-[0_20px_40px_rgba(2,6,23,0.35)] sm:p-12">
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Browse the full project archive for case studies, technologies, and links populated from the existing portfolio content.
          </p>
          <Link
            href="/portfolio"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-all hover:gap-3 sm:text-base"
          >
            Explore the project archive
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}