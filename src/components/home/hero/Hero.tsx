"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code2,
} from "lucide-react";
import { profile } from "@/config/profile";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#040d1a_0%,#071a2f_28%,#0a1f3c_52%,#091827_100%)]">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_center,rgba(15,23,42,0.72),transparent_60%)]" />



      {/* ============================================================
          HERO CONTENT
      ============================================================= */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-32 lg:pt-14 lg:px-8">
        {/* ---------------- LEFT: copy ---------------- */}
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-400/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 shadow-sm shadow-blue-500/10 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {profile.availability}
          </div>

          <h1 className="max-w-xl text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Hi, I&apos;m {profile.name}.
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
              {profile.headline}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
            {profile.introduction}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/portfolio"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform duration-200 hover:-translate-y-0.5"
            >
              View my projects
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10"
            >
              Contact me
            </Link>
          </div>

          <div className="mt-14">
            <p className="mb-4 text-xs font-medium text-slate-300">Working across</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {profile.stack.slice(0, 5).map((technology) => (
                <span
                  key={technology}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-200"
                >
                  <Code2 className="h-4 w-4 text-cyan-300" />
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: image collage ---------------- */}
        <div className="relative mx-auto h-[470px] w-full max-w-[500px] sm:h-[560px] lg:mx-0 lg:h-[620px] lg:max-w-none">
          {/* dashed connector line */}
          <svg
            className="pointer-events-none absolute bottom-2 left-2 h-28 w-28 -z-10 opacity-80 sm:h-36 sm:w-36"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M10 190 C 40 150, 20 100, 90 60"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.7"
            />
            <circle cx="10" cy="190" r="5" fill="#3b82f6" />
          </svg>

          {/* building — main background image */}
          <div className="absolute left-0 top-[16%] h-[40%] w-[80%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/building.jpeg"
              alt="Modern glass building at dusk"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </div>

          {/* laptop dashboard — top right */}
          <div className="absolute right-20 top-0 h-[26%] w-[46%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/laptop.jpeg"
              alt="Laptop showing an analytics dashboard"
              fill
              sizes="(max-width: 1024px) 50vw, 26vw"
              className="object-cover"
            />
          </div>

          {/* team photo — bottom left */}
          <div className="absolute bottom-33 left-[8%] h-[28%] w-[42%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/team.jpeg"
              alt="Team collaborating around a laptop"
              fill
              sizes="(max-width: 1024px) 44vw, 22vw"
              className="object-cover"
            />
          </div>

          {/* phone mockup — bottom right */}
          <div className="absolute top-[43%] right-[15%] h-[40%] w-[30%] overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl shadow-black/40">
            <Image
              src="/home/app-screen.jpeg"
              alt="Mobile app screen reading Digital Experience Reimagined"
              fill
              sizes="(max-width: 1024px) 30vw, 22vw"
              className="object-fill"
            />
          </div>

          {/* floating card — AI Automation */}
          <FloatingCard
            className="left-[6%] top-[2%] w-[38%] sm:w-[38%]"
            icon={<Code2 size={18} />}
            title={profile.title}
            subtitle="Frontend to backend"
          />

          <FloatingCard
            className="right-[-2%] top-[32%] w-[36%] sm:w-[36%]"
            icon={<Code2 size={18} />}
            title="Build"
            titleClassName="text-cyan-300"
            subtitle="Useful, durable software"
          />

          {/* floating card — Custom Software */}
          <FloatingCard
            className="bottom-[10%] left-[24%] w-[45%] sm:w-[46%]"
            icon={<Code2 size={18} />}
            title="Ship"
            subtitle="From idea to production"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                      */
/* ------------------------------------------------------------------ */

function FloatingCard({
  className = "",
  icon,
  title,
  titleClassName = "text-slate-900",
  subtitle,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  titleClassName?: string;
  subtitle: string;
}) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 shadow-xl shadow-blue-900/30 backdrop-blur-md ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-cyan-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-base font-bold leading-tight ${titleClassName}`}>
          {title}
        </span>
        <span className="block text-xs font-medium text-slate-300">{subtitle}</span>
      </span>
    </div>
  );
}
