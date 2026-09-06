// src/components/home/services/ServiceCard.tsx

import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";

import type { PublicService } from "./ServicesSection";

type Props = {
  service: PublicService & {
    image?: string | null;
  };
};

export default function ServiceCard({ service }: Props) {
  const iconName =
    typeof service.icon === "string"
      ? service.icon
      : "Box";

  const Icon =
    (Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{
      className?: string;
      strokeWidth?: number;
    }>) ?? Icons.Box;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10">
      <div className="relative h-52 shrink-0 overflow-hidden bg-slate-100 sm:h-56">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
            <Icon className="h-14 w-14 text-blue-600/70" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/90 shadow-lg backdrop-blur-md">
          <Icon
            className="h-5 w-5 text-blue-600"
            strokeWidth={2.2}
          />
        </div>

        {service.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
          {service.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          {service.shortDescription ||
            service.description ||
            service.content}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-all group-hover:gap-3"
        >
          Learn More
          <Icons.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}