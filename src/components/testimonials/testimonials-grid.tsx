"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Quote,
    Star,
} from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "James Wilson",
        company: "Fintech Solutions",
        role: "CEO",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        rating: 5,
        review:
            "ADM transformed our vision into a premium product. Their communication, design quality, and technical expertise exceeded our expectations.",
    },
    {
        id: 2,
        name: "Sophia Carter",
        company: "HealthCare Pro",
        role: "Product Manager",
        image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        rating: 5,
        review:
            "The team delivered an enterprise-grade solution on schedule. The UI/UX quality alone significantly improved our customer engagement.",
    },
    {
        id: 3,
        name: "Michael Brown",
        company: "TechNova",
        role: "Founder",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        rating: 5,
        review:
            "Professional, transparent, and highly skilled. ADM became more than a development company—they became our technology partner.",
    },
];


export default function TestimonialsGrid() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Client Reviews
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900">
                        What Our Clients Say
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        Every successful partnership starts with
                        trust, collaboration, and delivering real
                        business value.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map(
                        (
                            item,
                            index
                        ) => (
                            <motion.article
                                key={
                                    item.id
                                }
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay:
                                        index *
                                        0.1,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                            >
                                <div className="absolute right-8 top-8 rounded-full bg-blue-50 p-3 text-blue-600">
                                    <Quote size={22} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Image
                                        src={
                                            item.image
                                        }
                                        alt={
                                            item.name
                                        }
                                        width={
                                            70
                                        }
                                        height={
                                            70
                                        }
                                        className="h-16 w-16 rounded-full object-cover"
                                    />

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {
                                                item.name
                                            }
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            {
                                                item.role
                                            }
                                        </p>

                                        <p className="text-sm font-medium text-blue-600">
                                            {
                                                item.company
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-1">
                                    {Array.from({
                                        length:
                                            item.rating,
                                    }).map(
                                        (
                                            _,
                                            i
                                        ) => (
                                            <Star
                                                key={
                                                    i
                                                }
                                                size={
                                                    18
                                                }
                                                fill="currentColor"
                                                className="text-amber-400"
                                            />
                                        )
                                    )}
                                </div>

                                <p className="mt-6 leading-8 text-slate-600">
                                    "
                                    {
                                        item.review
                                    }
                                    "
                                </p>
                            </motion.article>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}