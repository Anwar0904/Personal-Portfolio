"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RelatedServices({ services = [] }: { services?: Array<{ slug: string; title: string; shortDescription?: string; image?: string | null }> }) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="px-4 pb-24 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              Continue Exploring
            </span>

            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Related Services
            </h2>
          </div>

          <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-blue-300 transition hover:gap-3 hover:text-blue-200">
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_18px_45px_rgba(2,6,23,0.45)] transition duration-500 hover:-translate-y-2 hover:border-blue-300/30 hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
              <div className="relative aspect-16/10 overflow-hidden">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-900 via-slate-800 to-sky-950 text-4xl font-black text-cyan-300">
                    {service.title.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              </div>

              <div className="space-y-5 p-7">
                <h3 className="text-2xl font-bold text-white transition group-hover:text-blue-300">{service.title}</h3>
                <p className="leading-7 text-slate-300">{service.shortDescription}</p>
                <div className="flex items-center gap-2 font-semibold text-blue-300">
                  Learn More
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}