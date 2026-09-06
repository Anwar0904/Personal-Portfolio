import CompanyLogo from "./CompanyLogo";
import { trustedCompanies } from "./data";

const companies = [
  ...trustedCompanies,
  ...trustedCompanies,
  ...trustedCompanies,
];

export default function TrustedCompanies() {
  return (
    <section className="overflow-hidden border-y border-border bg-surface-alt py-12 sm:py-14 lg:py-16">
      {/* Heading */}
      <div className="mx-auto mb-8 w-full max-w-7xl px-4 sm:mb-10 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-text-soft sm:text-xs sm:tracking-[0.3em]">
          Trusted by innovative companies
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent sm:w-24 lg:w-40" />

        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-50 to-transparent sm:w-24 lg:w-40" />

        <div className="group">
          <div
            className="
                            flex
                            w-max
                            items-center
                            gap-4
                            px-2
                            sm:gap-6
                            lg:gap-8
                            animate-[marquee_35s_linear_infinite]
                            group-hover:[animation-play-state:paused]
                        "
          >
            {companies.map(
              (company, index) => (
                <div
                  key={`${company.id}-${index}`}
                  className="shrink-0"
                >
                  <CompanyLogo
                    name={
                      company.name
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}