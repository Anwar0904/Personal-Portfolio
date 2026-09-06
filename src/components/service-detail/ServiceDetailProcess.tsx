"use client";

import {
  Search,
  PenTool,
  Code2,
  FlaskConical,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    subtitle: "Understanding your business",
    description:
      "Stakeholder workshops, business analysis, competitor research, user journey mapping, and technical feasibility.",
  },
  {
    icon: PenTool,
    title: "UX & Strategy",
    subtitle: "Planning the experience",
    description:
      "Wireframes, design systems, information architecture, AI workflow planning, and product strategy.",
  },
  {
    icon: Code2,
    title: "Development",
    subtitle: "Building the solution",
    description:
      "Modern engineering using scalable architecture, secure APIs, automated testing, and clean code practices.",
  },
  {
    icon: FlaskConical,
    title: "Testing",
    subtitle: "Quality assurance",
    description:
      "Performance optimization, accessibility testing, security review, device compatibility, and bug fixing.",
  },
  {
    icon: Rocket,
    title: "Launch",
    subtitle: "Production deployment",
    description:
      "CI/CD deployment, monitoring, SEO validation, analytics integration, and production optimization.",
  },
  {
    icon: ShieldCheck,
    title: "Growth",
    subtitle: "Long-term partnership",
    description:
      "Continuous improvements, feature expansion, maintenance, optimization, and strategic consulting.",
  },
];

export default function ServiceDetailProcess() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Our Delivery Framework
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            From Idea to Scalable Product
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Every ADM project follows a structured execution process designed
            for transparency, speed, and long-term scalability.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-slate-200 lg:block" />

          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl lg:flex-row lg:items-center"
                >
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-4">
                      <span className="text-sm font-bold text-blue-600">
                        STEP {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 font-medium text-blue-600">
                      {step.subtitle}
                    </p>

                    <p className="mt-4 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}