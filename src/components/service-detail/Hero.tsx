"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function Hero({ service }: { service: any }) {
  const title = service?.title || "Service";
  const subtitle = service?.shortDescription || "Modern digital solutions built to help your business move faster and smarter.";
  const image = service?.image || service?.featuredImage || null;
  const featureList = Array.isArray(service?.featureList) && service.featureList.length
    ? service.featureList.slice(0, 3)
    : [
      { title: "Strategy & planning" },
      { title: "Design & workflow" },
      { title: "Launch & support" },
    ];

  const handleDownloadPdf = () => {
    if (typeof window === "undefined") return;

    const features = (Array.isArray(service?.featureList) ? service.featureList : [])
      .slice(0, 6)
      .map((item: any) => `<li>${escapeHtml(item.title || "Key deliverable")}</li>`)
      .join("");

    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");

    if (!printWindow) {
      window.print();
      return;
    }

    const featureMarkup = features
      ? `<ul>${features}</ul>`
      : `<ul><li>Strategy & planning</li><li>Design & workflow</li><li>Launch & support</li></ul>`;

    printWindow.document.write(`<!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(title)} | ADM</title>
          <style>
            body { font-family: Arial, sans-serif; background: #071425; color: #ecf7ff; margin: 0; padding: 32px; }
            .wrap { max-width: 820px; margin: 0 auto; background: #0b1526; border: 1px solid rgba(148,163,184,0.25); border-radius: 22px; padding: 32px; }
            h1 { margin: 0 0 12px; font-size: 32px; line-height: 1.2; }
            .tag { display: inline-block; background: rgba(59,130,246,0.12); color: #bfdbfe; border: 1px solid rgba(96,165,250,0.35); border-radius: 9999px; padding: 8px 14px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
            p { color: #c4d8f4; line-height: 1.8; }
            ul { padding-left: 20px; color: #d7e9ff; line-height: 1.8; }
            .meta { margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(148,163,184,0.2); font-size: 13px; color: #a8c0df; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="tag">ADM Digital Service</div>
            <h1>${escapeHtml(title)}</h1>
            <p>${escapeHtml(subtitle)}</p>
            ${featureMarkup}
            <div class="meta">Prepared for PDF export from ADM services library.</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  };

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_25%),linear-gradient(180deg,#020816_0%,#081a2d_40%,#081523_100%)]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-175 w-175 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-slate-300"
        >
          <Link href="/" className="transition hover:text-blue-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="transition hover:text-blue-300">
            Services
          </Link>
          <span>/</span>
          <span className="font-medium text-white">{title}</span>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              {service?.seo?.metaTitle || "Digital Service"}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              {subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/consultation" className="inline-flex items-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-[0_15px_40px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5">
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                <ArrowDownToLine className="mr-2 h-5 w-5" />
                Download PDF
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {featureList.map((item: { title: string }, index: number) => (
                <div key={`${item.title}-${index}`} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-3 text-sm font-medium text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                  {item.title}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-linear-to-br from-blue-500/20 via-cyan-400/20 to-transparent blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 shadow-[0_30px_80px_rgba(15,23,42,0.8)]">
              {image ? (
                <img src={image} alt={title} className="aspect-4/3 h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-4/3 items-center justify-center bg-linear-to-br from-blue-900/60 via-slate-900 to-sky-950 text-5xl font-black text-cyan-300">
                  {title.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-6 top-8 hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl lg:block">
              <p className="text-sm text-slate-300">Strategy</p>
              <h3 className="mt-2 text-3xl font-black text-cyan-300">Built</h3>
            </motion.div>

            <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl lg:block">
              <p className="text-sm text-slate-300">Delivery</p>
              <h3 className="mt-2 text-3xl font-black text-white">Fast</h3>
              <span className="font-semibold text-blue-300">Execution</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}