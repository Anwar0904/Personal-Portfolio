"use client";

import { faqCategories } from "@/lib/dummy/faqs";

export default function FAQCategories() {
    return (
        <section className="border-b border-slate-200 bg-white py-8">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {faqCategories.map(
                        (category) => (
                            <button
                                key={
                                    category.id
                                }
                                className="
                                whitespace-nowrap
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                transition-all
                                hover:border-blue-600
                                hover:bg-blue-600
                                hover:text-white
                            "
                            >
                                {
                                    category.title
                                }
                            </button>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}