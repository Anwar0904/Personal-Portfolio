import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

const faqs = [
  {
    question: "What services does ADM provide?",
    answer:
      "ADM specializes in AI and intelligent systems, digital platforms, mobile applications, UI/UX design, enterprise technology, cloud infrastructure, and digital transformation.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Depending on project scope, most projects are completed between 4–16 weeks using an agile development process.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. We offer maintenance, cloud monitoring, feature enhancements, performance optimization, and long-term technical support.",
  },
  {
    question: "Can ADM build AI-powered software?",
    answer:
      "Absolutely. AI automation, LLM integrations, intelligent assistants, chatbots, and AI-powered business workflows are among our core capabilities.",
  },
];

export default function FaqSection() {
  return (
    <section className="section-shell bg-slate-950/80">
      <div className="section-content">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="section-kicker">
            FAQ
          </span>

          <h2 className="section-title">
            Frequently Asked Questions
          </h2>

          <p className="section-copy text-slate-300">
            Everything you need to know before starting your next digital
            project with ADM.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_18px_45px_rgba(2,6,23,0.45)] transition-all duration-300 open:border-blue-400/40 open:shadow-[0_22px_55px_rgba(37,99,235,0.16)] sm:rounded-3xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 lg:p-7">
                <h3 className="text-base font-bold leading-6 text-white sm:text-lg lg:text-xl">
                  {faq.question}
                </h3>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition-all duration-300 group-open:rotate-45 group-open:bg-blue-600 group-open:text-white sm:h-10 sm:w-10">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </summary>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
                <div className="mb-4 h-px bg-white/10 sm:mb-5" />

                <p className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-14">
          <Link
            href="/faq"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-100 shadow-sm transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-200 hover:shadow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            View All FAQs
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}