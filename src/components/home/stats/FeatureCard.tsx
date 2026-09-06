import { CheckCircle2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: Props) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_18px_35px_rgba(2,6,23,0.25)] sm:gap-4 sm:p-5">
      <div className="mt-0.5 shrink-0 rounded-full bg-blue-500/15 p-1.5">
        <CheckCircle2 className="h-5 w-5 text-cyan-300 sm:h-6 sm:w-6" />
      </div>

      <div className="min-w-0">
        <h4 className="text-base font-bold text-white sm:text-lg">
          {title}
        </h4>

        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-300 sm:mt-2 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
    </div>
  );
}