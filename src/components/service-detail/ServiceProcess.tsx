import {
  BrainCircuit,
  SearchCheck,
  Palette,
  Code2,
  Rocket,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const process = [
  {
    icon: SearchCheck,
    title: "Discovery",
    description:
      "Business goals, competitors, users, technical requirements and AI opportunities.",
  },
  {
    icon: Palette,
    title: "UX Strategy",
    description:
      "Information architecture, wireframes, user journeys and visual system.",
  },
  {
    icon: Code2,
    title: "Development",
    description:
      "High-performance implementation using modern technologies and best practices.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Deployment, testing, optimization and production monitoring.",
  },
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "AI APIs",
  "OpenAI",
  "AWS",
  "Docker",
];

const deliverables = [
  "Responsive UI/UX",
  "Production-ready Code",
  "API Integration",
  "SEO Optimization",
  "Performance Optimization",
  "Admin Dashboard",
  "Documentation",
  "Deployment Support",
];

export default function ServiceProcessSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
            How We Deliver
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            From Strategy to Successful Delivery
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Every project follows a structured delivery framework focused on
            business value, scalability and exceptional user experience.
          </p>
        </div>

        {/* Process */}

        <div className="mt-20 grid gap-8 lg:grid-cols-4">
          {process.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <span className="absolute right-8 top-8 text-5xl font-black text-slate-100">
                  0{index + 1}
                </span>

                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technologies */}

        <div className="mt-24 grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <BrainCircuit className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Technologies
                </h3>

                <p className="text-slate-600">
                  Modern stack for enterprise-grade solutions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables */}

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-sky-500 p-10 text-white">
            <h3 className="mb-8 text-2xl font-bold">
              What You'll Receive
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />

                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6" />

                <h4 className="text-lg font-semibold">
                  Quality Guarantee
                </h4>
              </div>

              <p className="mt-4 text-blue-100 leading-7">
                Every project goes through rigorous QA, performance
                optimization, security review and responsive testing before
                delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
);
}