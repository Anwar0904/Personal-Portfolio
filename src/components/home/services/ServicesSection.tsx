"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";

export type PublicService = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  content?: string;

  icon?: string | null;

  banner?:
  | string
  | {
    _id?: string;
    url?: string;
  }
  | null;

  featuredImage?:
  | string
  | {
    _id?: string;
    url?: string;
  }
  | null;

  features?: {
    title: string;
    description: string;
  }[];

  faqs?: {
    question: string;
    answer: string;
  }[];

  status: string;
  featured?: boolean;
  sortOrder?: number;
};

function mediaUrl(
  value:
    | PublicService["banner"]
    | PublicService["featuredImage"]
) {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  return value.url ?? null;
}

function ServiceCard({
  service,
}: {
  service: PublicService;
}) {
  const iconName =
    typeof service.icon === "string" && service.icon.trim()
      ? service.icon
      : "Box";

  const Icon =
    (Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{
      className?: string;
      strokeWidth?: number;
    }>) ?? Icons.Box;

  const image =
    mediaUrl(service.featuredImage) ??
    mediaUrl(service.banner);

  const description =
    service.shortDescription ||
    service.description ||
    service.content ||
    "Explore the systems and digital products I build.";

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-slate-900/70
        shadow-[0_20px_40px_rgba(8,15,30,0.38)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-400/40
        hover:shadow-[0_20px_45px_rgba(37,99,235,0.22)]
        sm:rounded-3xl
      "
    >
      {/* Image */}
      <div
        className="
          relative
          h-48
          w-full
          shrink-0
          overflow-hidden
          bg-slate-100
          sm:h-56
          lg:h-60
        "
      >
        {image ? (
          <Image
            src={image}
            alt={service.title}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            className="
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-blue-50
              via-white
              to-slate-100
            "
          >
            <Icon
              className="h-14 w-14 text-blue-600/60 sm:h-16 sm:w-16"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Image overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950/65
            via-slate-950/10
            to-transparent
          "
        />

        {/* Icon */}
        <div
          className="
            absolute
            left-4
            top-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/60
            bg-white/90
            shadow-lg
            backdrop-blur-md
            sm:left-5
            sm:top-5
            sm:h-11
            sm:w-11
            sm:rounded-2xl
          "
        >
          <Icon
            className="h-5 w-5 text-blue-600 sm:h-5.5 sm:w-5.5"
            strokeWidth={2.2}
          />
        </div>

        {/* Featured */}
        {service.featured && (
          <span
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-blue-600
              px-3
              py-1.5
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-white
              shadow-lg
              sm:right-5
              sm:top-5
            "
          >
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="
          flex
          flex-1
          flex-col
          p-5
          sm:p-6
          lg:p-7
        "
      >
        <h3
          className="
            line-clamp-2
            text-lg
            font-black
            leading-tight
            tracking-tight
            text-white
            sm:text-xl
            lg:text-2xl
          "
        >
          {service.title}
        </h3>

        <p
          className="
            mt-3
            line-clamp-3
            text-sm
            leading-6
            text-slate-300
            sm:text-base
            sm:leading-7
          "
        >
          {description}
        </p>

        {/* Learn More */}
        <Link
          href={`/services/${service.slug}`}
          className="
            group/link
            mt-5
            inline-flex
            min-h-10
            w-fit
            items-center
            gap-2
            rounded-lg
            text-sm
            font-bold
            text-cyan-300
            transition-all
            duration-200
            hover:text-cyan-200
            sm:mt-6
            sm:text-base
          "
        >
          Learn More

          <Icons.ArrowRight
            className="
              h-4
              w-4
              transition-transform
              duration-200
              group-hover/link:translate-x-1
            "
          />
        </Link>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/public/services",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load services (${response.status})`
          );
        }

        const result = await response.json();

        const data: PublicService[] =
          Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.services)
              ? result.data.services
              : [];

        if (!mounted) return;

        const sortedServices = data
          .filter(
            (service) =>
              service &&
              !["draft", "archived"].includes(
                service.status?.toLowerCase()
              )
          )
          .sort(
            (a, b) =>
              (a.sortOrder ?? 0) -
              (b.sortOrder ?? 0)
          );

        setServices(sortedServices);
      } catch (error) {
        console.error(
          "ServicesSection:",
          error
        );

        if (mounted) {
          setServices([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_20%),linear-gradient(180deg,#081420_0%,#0b1d33_35%,#091827_100%)]
        py-16
        sm:py-20
        md:py-24
        lg:py-32
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          -z-0
          h-64
          w-64
          -translate-x-1/2
          rounded-full
          bg-blue-500/5
          blur-3xl
          sm:h-80
          sm:w-80
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-1/2
          -z-0
          h-72
          w-72
          rounded-full
          bg-sky-400/5
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Header */}
        <div
          className="
            mx-auto
            mb-10
            max-w-3xl
            text-center
            sm:mb-14
            md:mb-16
            lg:mb-20
          "
        >
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-blue-400/30
              bg-blue-500/10
              px-3
              py-1.5
              text-[11px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-200
              sm:px-4
              sm:py-2
              sm:text-xs
              md:text-sm
            "
          >
            Expertise
          </span>

          <h2
            className="
              section-title
              max-w-2xl
              text-white
            "
          >
            Digital products built
            <span className="text-cyan-300">
              {" "}
              for real use
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-300
              sm:mt-4
              sm:text-base
              sm:leading-7
              md:text-lg
              lg:mt-2
              lg:text-lg
              md:leading-8
            "
          >
            Explore the services managed through the existing content system and presented here as the areas I work in.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    sm:rounded-3xl
                  "
                >
                  <div
                    className="
                      h-48
                      animate-pulse
                      bg-slate-100
                      sm:h-56
                      lg:h-60
                    "
                  />

                  <div className="space-y-4 p-5 sm:p-6 lg:p-7">
                    <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />

                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : services.length > 0 ? (
          /* Services */
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="
              mx-auto
              max-w-2xl
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-slate-50
              px-5
              py-12
              text-center
              sm:rounded-3xl
              sm:px-8
              sm:py-16
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
              "
            >
              <Icons.BriefcaseBusiness
                className="h-6 w-6"
              />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-bold
                text-slate-900
                sm:text-xl
              "
            >
              Expertise is being updated
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              The public service list is being updated. Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}