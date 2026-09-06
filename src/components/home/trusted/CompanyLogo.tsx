interface CompanyLogoProps {
  name: string;
}

export default function CompanyLogo({
  name,
}: CompanyLogoProps) {
  return (
    <div className="flex h-16 min-w-[150px] items-center justify-center rounded-xl border border-border bg-surface px-6 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-md sm:h-[72px] sm:min-w-[180px] sm:px-8 lg:min-w-[200px]">
      <span className="whitespace-nowrap text-sm font-bold tracking-wide text-text-soft transition-colors duration-300 group-hover:text-text sm:text-base">
        {name}
      </span>
    </div>
  );
}