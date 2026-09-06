"use client";

import CountUp from "react-countup";

type Props = {
  number: string;
  label: string;
};

export default function StatCard({
  number,
  label,
}: Props) {
  const value = parseInt(number, 10);
  const suffix = number.replace(/[0-9]/g, "");

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-slate-900/70
        p-5
        shadow-[0_18px_35px_rgba(2,6,23,0.25)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-400/40
        hover:shadow-[0_20px_40px_rgba(37,99,235,0.18)]
        sm:rounded-3xl
        sm:p-6
        lg:p-7
      "
    >
      <h3 className="text-3xl font-black tracking-tight text-cyan-300 sm:text-4xl lg:text-5xl">
        <CountUp
          end={value}
          duration={2}
          enableScrollSpy
          scrollSpyOnce
        />
        {suffix}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-300 sm:mt-3">
        {label}
      </p>
    </div>
  );
}