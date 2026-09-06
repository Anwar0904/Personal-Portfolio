import Image from "next/image";

import { stats, features } from "./data";
import StatCard from "./StatCard";
import FeatureCard from "./FeatureCard";

export default function StatsSection() {
  return (
    <section className="section-shell light-panel">
      <div className="section-content">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">

          {/* Content */}
          <div className="min-w-0">
            <span className="section-kicker">
              Why ADM
            </span>

            <h2 className="section-title max-w-2xl">
              Precision Engineering Meets Creative Innovation
            </h2>

            <p className="section-copy max-w-2xl">
              We build AI-powered digital products that are scalable,
              secure, and designed for long-term business growth.
            </p>

            <div className="mt-9 space-y-7 sm:mt-12 sm:space-y-8">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>
          </div>

          {/* Visual + Stats */}
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <div className="relative overflow-hidden rounded-3xl shadow-xl sm:rounded-[40px]">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                alt="ADM team collaborating on digital solutions"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[400px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((item) => (
                <StatCard
                  key={item.id}
                  number={item.number}
                  label={item.label}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}