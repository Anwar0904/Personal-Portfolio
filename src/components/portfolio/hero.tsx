import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  PlayCircle,
} from "lucide-react";

export default function PortfolioHero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#040b15_0%,#071423_38%,#091827_100%)]">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-6 pt-36 pb-24 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4" />
              Selected Work That Speaks For Itself
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                Digital Products
                <br />
                That Deliver
                <span className="block bg-linear-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Real Business Impact
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Explore a collection of websites, AI platforms, enterprise
                systems, SaaS products, branding projects and modern digital
                experiences we've crafted for ambitious businesses worldwide.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#projects"
                className="group inline-flex items-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/30"
              >
                Explore Engagements
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>

              <Link
                href="/consultation"
                className="group inline-flex items-center rounded-xl border border-white/10 bg-slate-900/40 px-8 py-4 font-semibold text-slate-100 shadow-sm transition-all hover:border-blue-400 hover:text-blue-300"
              >
                Start Your Project
                <PlayCircle className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-6 pt-8">
              <div>
                <h3 className="text-4xl font-black text-blue-400">50+</h3>
                <p className="mt-2 text-sm text-slate-300">Engagements Delivered</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-blue-400">98%</h3>
                <p className="mt-2 text-sm text-slate-300">Organization Satisfaction</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-blue-400">12+</h3>
                <p className="mt-2 text-sm text-slate-300">Industries Served</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(2,6,23,0.7)]">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=80"
                alt="Portfolio Showcase"
                width={900}
                height={700}
                className="h-[620px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-blue-200">
                        Featured Case Study
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-white">
                        AI Powered Healthcare Platform
                      </h3>

                      <p className="mt-2 text-slate-300">
                        Reduced operational workload by 62% using intelligent
                        automation.
                      </p>
                    </div>

                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-10 top-20 hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl lg:block">
              <p className="text-xs uppercase tracking-widest text-slate-300">
                Average Rating
              </p>
              <h3 className="mt-2 text-4xl font-black text-blue-300">4.9★</h3>
            </div>

            <div className="absolute -right-10 bottom-28 hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl lg:block">
              <p className="text-xs uppercase tracking-widest text-slate-300">
                Revenue Growth
              </p>
              <h3 className="mt-2 text-4xl font-black text-emerald-400">+210%</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}