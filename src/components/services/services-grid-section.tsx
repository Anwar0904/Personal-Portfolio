
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "AI & Intelligent Systems",
    description:
      "Custom AI systems, chatbots, automation, LLM integrations and intelligent business workflows.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    href: "/services/ai-solutions",
  },
  {
    title: "Digital Platforms & Engineering",
    description:
      "Modern websites and enterprise web applications using Next.js, React and scalable architecture.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    href: "/services/web-development",
  },
  {
    title: "Mobile Applications",
    description:
      "Cross-platform mobile apps with beautiful UI, excellent performance and native experience.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    href: "/services/mobile-apps",
  },
  {
    title: "UI / UX Design",
    description:
      "Research-driven interfaces focused on usability, accessibility and premium user experience.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80",
    href: "/services/ui-ux",
  },
];

export default function ServicesGridSection() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Our Capabilities
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Capabilities Built
            <span className="block text-blue-400">
              Around Your Business Goals
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Every service is carefully engineered to deliver measurable
            business value with outstanding performance, scalability and
            exceptional user experience.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_22px_60px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-[0_25px_80px_rgba(37,99,235,0.25)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>

              <div className="space-y-5 p-8">
                <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-blue-300">
                  {service.title}
                </h3>

                <p className="leading-7 text-slate-300">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 font-semibold text-blue-300 transition-all group-hover:gap-4"
                >
                  Learn More

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}