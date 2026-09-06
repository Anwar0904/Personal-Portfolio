import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative flex justify-center overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#020b17_0%,#071a2d_38%,#0c2342_100%)]" />

      <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute left-1/2 top-1/2 h-87.5 w-87.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[100px] sm:h-125 sm:w-125 sm:blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[32px_32px] sm:bg-size-[50px_50px]" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex max-w-full items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-semibold text-slate-100 backdrop-blur-md sm:px-5 sm:text-sm">
            🚀 Let&apos;s Build Something Extraordinary
          </span>

          <h2 className="mt-4 text-2xl font-black leading-[1.08] tracking-tight text-white sm:mt-6 sm:text-3xl md:text-4xl lg:mt-8 lg:text-5xl xl:text-6xl">
            Ready To Transform
            <br className="hidden sm:block" /> Your Business?
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-200 sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:text-xl lg:leading-9">
            Whether you&apos;re launching a startup, modernizing an enterprise, or
            integrating Artificial Intelligence into your business, ADM is
            ready to turn your vision into reality.
          </p>

          <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl sm:mt-12 sm:grid-cols-4 sm:rounded-2xl md:mt-16 lg:rounded-3xl">
            <Stat value="50+" label="Engagements" />
            <Stat value="98%" label="Organization Satisfaction" />
            <Stat value="24/7" label="Support" />
            <Stat value="AI" label="Powered" />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4 md:gap-5 lg:mt-16">
            <Link
              href="/consultation"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-5 sm:text-lg lg:px-10"
            >
              <CalendarDays className="h-5 w-5 shrink-0 text-blue-700 sm:h-6 sm:w-6" />

              <span className="text-blue-700">Book Free Consultation</span>

              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1.5 sm:group-hover:translate-x-2" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-white/15 bg-slate-900/20 px-6 py-4 text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 sm:w-auto sm:px-8 sm:py-5 sm:text-lg lg:px-10"
            >
              Contact Our Team
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-200 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 md:mt-14 lg:mt-16 lg:text-sm lg:gap-x-8">
            <Benefit>Free Discovery Call</Benefit>
            <Benefit>No Hidden Charges</Benefit>
            <Benefit>AI-First Solutions</Benefit>
            <Benefit>Dedicated Support</Benefit>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
      <h3 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-200 sm:mt-2 sm:text-sm lg:text-base">
        {label}
      </p>
    </div>
  );
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true">✓</span>
      {children}
    </span>
  );
}