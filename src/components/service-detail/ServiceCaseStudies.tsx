"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Clock3, Users } from "lucide-react";
import { motion } from "framer-motion";

const caseStudies = [
  {
    id: 1,
    title: "AI Customer Support Platform",
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    description:
      "Built an enterprise AI assistant capable of answering thousands of customer queries while integrating seamlessly with CRM systems.",

    metrics: [
      {
        label: "Support Cost",
        value: "-63%",
        icon: TrendingUp,
      },
      {
        label: "Response Time",
        value: "3 sec",
        icon: Clock3,
      },
      {
        label: "Daily Users",
        value: "120K+",
        icon: Users,
      },
    ],
  },
  {
    id: 2,
    title: "Digital Banking Platform",
    category: "FinTech",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Modern banking ecosystem with secure authentication, AI fraud detection and real-time financial analytics.",

    metrics: [
      {
        label: "Transactions",
        value: "8M+",
        icon: TrendingUp,
      },
      {
        label: "Availability",
        value: "99.99%",
        icon: Clock3,
      },
      {
        label: "Organizations",
        value: "500K+",
        icon: Users,
      },
    ],
  },
];

export default function ServiceCaseStudies() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Success Stories
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Real Results.
            <span className="text-blue-600"> Real Businesses.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Every project we build is designed to generate measurable
            business impact—not just beautiful software.
          </p>
        </div>

        <div className="mt-20 space-y-20">
          {caseStudies.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className={`grid items-center gap-14 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
            >
              {/* Image */}

              <div className="group overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}

              <div>
                <span className="font-semibold text-blue-600">
                  {project.category}
                </span>

                <h3 className="mt-3 text-4xl font-bold text-slate-900">
                  {project.title}
                </h3>

                <p className="mt-6 leading-8 text-slate-600">
                  {project.description}
                </p>

                {/* Metrics */}

                <div className="mt-10 grid gap-5 sm:grid-cols-3">
                  {project.metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                      <div
                        key={metric.label}
                        className="rounded-2xl border bg-white p-5 shadow-sm"
                      >
                        <Icon className="mb-4 h-6 w-6 text-blue-600" />

                        <h4 className="text-3xl font-black text-slate-900">
                          {metric.value}
                        </h4>

                        <p className="mt-2 text-sm text-slate-500">
                          {metric.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/portfolio"
                  className="mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
                >
                  View Full Case Study

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}

        <div className="mt-24 rounded-[40px] bg-gradient-to-r from-blue-600 to-cyan-500 p-12 text-center text-white shadow-2xl">

          <h3 className="text-4xl font-bold">
            Your Business Could Be Our Next Success Story
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            We combine strategy, AI, design and engineering to build products
            that generate measurable business growth.
          </p>

          <div className="mt-10">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition hover:scale-105"
            >
              Start Your Project

              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}