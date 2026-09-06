"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  BadgeDollarSign,
  Users,
  Layers3,
} from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    icon: BadgeDollarSign,
    title: "Fixed Project",
    subtitle: "Best for well-defined projects",
    description:
      "Ideal when your scope, timeline and deliverables are clearly defined before development starts.",
    price: "Starting at $5k",
    highlighted: false,
    features: [
      "Dedicated Project Manager",
      "UI/UX Design",
      "Development",
      "Testing & QA",
      "Deployment",
      "30 Days Support",
    ],
  },
  {
    icon: Layers3,
    title: "Dedicated Team",
    subtitle: "Most Popular",
    description:
      "A complete cross-functional team working as an extension of your company.",
    price: "Monthly",
    highlighted: true,
    features: [
      "Senior Developers",
      "UI/UX Designer",
      "AI Engineer",
      "QA Engineer",
      "Daily Standups",
      "Unlimited Iterations",
      "Priority Support",
    ],
  },
  {
    icon: Users,
    title: "Staff Augmentation",
    subtitle: "Flexible Scaling",
    description:
      "Quickly hire experienced engineers to strengthen your existing team.",
    price: "Custom",
    highlighted: false,
    features: [
      "Flexible Hiring",
      "Remote Team",
      "Weekly Reports",
      "Fast Onboarding",
      "Scalable Resources",
      "Enterprise Ready",
    ],
  },
];

export default function ServicePricing() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Engagement Models
          </span>

          <h2 className="mt-6 text-4xl font-bold lg:text-5xl">
            Flexible Ways To
            <span className="text-blue-600"> Work Together</span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Every business is different. Choose the collaboration model
            that perfectly fits your goals.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.title}
                whileHover={{ y: -10 }}
                className={`relative overflow-hidden rounded-[32px] border transition-all duration-300 ${plan.highlighted
                  ? "border-blue-600 bg-gradient-to-b from-blue-600 to-cyan-500 text-white shadow-2xl scale-105"
                  : "border-slate-200 bg-white shadow-lg"
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-1 text-sm font-bold text-blue-600">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-10">

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${plan.highlighted
                      ? "bg-white text-blue-600"
                      : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mt-8 text-3xl font-bold">
                    {plan.title}
                  </h3>

                  <p
                    className={`mt-2 ${plan.highlighted
                      ? "text-blue-100"
                      : "text-slate-500"
                      }`}
                  >
                    {plan.subtitle}
                  </p>

                  <div className="mt-8 text-4xl font-black">
                    {plan.price}
                  </div>

                  <p
                    className={`mt-6 leading-7 ${plan.highlighted
                      ? "text-blue-100"
                      : "text-slate-600"
                      }`}
                  >
                    {plan.description}
                  </p>

                  <div className="my-10 h-px bg-white/20" />

                  <div className="space-y-5">

                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2
                          className={`h-5 w-5 ${plan.highlighted
                            ? "text-white"
                            : "text-blue-600"
                            }`}
                        />

                        <span>{feature}</span>
                      </div>
                    ))}

                  </div>

                  <Link
                    href="/consultation"
                    className={`mt-10 flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold transition ${plan.highlighted
                      ? "bg-white text-blue-600 hover:scale-105"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    Book Consultation

                    <ArrowRight className="h-5 w-5" />
                  </Link>

                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">

          <h3 className="text-2xl font-bold">
            Need Something Custom?
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Large enterprise? Government? Startup? We create completely
            customized engagement models based on your business needs.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-blue-600 px-8 py-4 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            Contact Our Team

            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>

      </div>
    </section>
  );
}