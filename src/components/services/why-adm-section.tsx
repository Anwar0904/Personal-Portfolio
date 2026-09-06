
"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  Rocket,
  Users,
  Workflow,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-First Development",
    description:
      "Every solution is designed with automation, intelligence and future scalability in mind.",
  },
  {
    icon: Rocket,
    title: "Fast Delivery",
    description:
      "Agile workflow, rapid iterations and continuous deployment reduce time-to-market.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Secure architecture, authentication, authorization and production-ready infrastructure.",
  },
  {
    icon: Workflow,
    title: "Scalable Architecture",
    description:
      "Applications engineered for growth without sacrificing performance.",
  },
  {
    icon: Users,
    title: "Business Partnership",
    description:
      "We work like an extension of your team instead of just another software vendor.",
  },
  {
    icon: BadgeCheck,
    title: "Long-Term Support",
    description:
      "Continuous maintenance, monitoring and improvements after deployment.",
  },
];

export default function WhyADMSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb30,transparent_40%)]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              Why ADM
            </span>

            <h2 className="mt-8 text-4xl font-black leading-tight lg:text-5xl">
              More Than
              <span className="block text-blue-400">
                A Software Company
              </span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-300">
              We combine strategy, engineering, artificial intelligence and
              design into one complete digital ecosystem that helps companies
              innovate faster and stay ahead of competitors.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-5xl font-black text-blue-400">50+</h3>
                <p className="mt-2 text-slate-400">
                  Successful Projects
                </p>
              </div>

              <div>
                <h3 className="text-5xl font-black text-blue-400">98%</h3>
                <p className="mt-2 text-slate-400">
                  Organization Satisfaction
                </p>
              </div>

              <div>
                <h3 className="text-5xl font-black text-blue-400">10+</h3>
                <p className="mt-2 text-slate-400">
                  Technologies
                </p>
              </div>

              <div>
                <h3 className="text-5xl font-black text-blue-400">24/7</h3>
                <p className="mt-2 text-slate-400">
                  Technical Support
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className="group rounded-3xl border border-slate-800 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:border-blue-500/40 hover:bg-blue-500/10 hover:-translate-y-2"
                >
                  <div className="mb-6 inline-flex rounded-2xl bg-blue-600/20 p-4">
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>

                  <h3 className="mb-4 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="leading-7 text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}