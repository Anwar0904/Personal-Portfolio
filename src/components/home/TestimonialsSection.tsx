import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO • Nexus Technologies",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    review:
      "ADM completely transformed our business. Their AI-powered solutions improved efficiency beyond our expectations.",
  },
  {
    id: 2,
    name: "Michael Anderson",
    role: "Founder • Quantum Labs",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    review:
      "Professional team, outstanding communication and an exceptional final product. Highly recommended.",
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Director • Lumina Health",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    review:
      "Working with ADM felt like working with our own engineering team. Incredible quality and attention to detail.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-shell bg-slate-950/80">
      <div className="section-content">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="section-kicker">
            Testimonials
          </span>

          <h2 className="section-title">
            Trusted By Amazing Clients
          </h2>

          <p className="section-copy mx-auto max-w-2xl text-slate-300">
            We measure success through long-term partnerships and client
            satisfaction.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_22px_55px_rgba(37,99,235,0.18)] sm:rounded-3xl sm:p-7 lg:p-8"
            >
              <div className="mb-5 flex gap-1 sm:mb-6">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5"
                  />
                ))}
              </div>

              <p className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                &quot;{item.review}&quot;
              </p>

              <div className="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-500/30 sm:h-14 sm:w-14">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-white sm:text-base">
                    {item.name}
                  </h4>

                  <p className="mt-0.5 text-xs leading-5 text-slate-400 sm:text-sm">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-14">
          <Link
            href="/testimonials"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.45)] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            View All Testimonials
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}