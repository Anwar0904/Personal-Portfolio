"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "CEO",
        company: "Nexus Technologies",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
        rating: 5,
        project: "AI Customer Platform",
        result: "+320% Customer Engagement",
        quote:
            "ADM completely transformed our digital ecosystem. Their engineering quality, communication and AI expertise exceeded every expectation.",
    },
    {
        id: 2,
        name: "Michael Anderson",
        role: "Founder",
        company: "Quantum Finance",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
        rating: 5,
        project: "Fintech Dashboard",
        result: "68% Faster Operations",
        quote:
            "From product strategy to deployment, every decision was backed by research and experience. It felt like working with an in-house team.",
    },
    {
        id: 3,
        name: "Emily Carter",
        role: "Marketing Director",
        company: "Lumina Group",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
        rating: 5,
        project: "Brand Transformation",
        result: "3.8x Conversion Growth",
        quote:
            "The user experience they created changed how customers interact with our brand. Beautiful design combined with outstanding performance.",
    },
];

export default function PortfolioTestimonials() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
            <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[140px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
                        Client Testimonials
                    </span>

                    <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                        Trusted By
                        <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Visionary Businesses
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        Real partnerships. Real impact. Real business growth.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 45 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="absolute right-8 top-8 text-blue-400/30 transition-all duration-500 group-hover:scale-125">
                                <Quote size={70} strokeWidth={1} />
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={70}
                                        height={70}
                                        className="h-[70px] w-[70px] rounded-2xl object-cover"
                                    />

                                    <div>
                                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                        <p className="text-sm text-slate-400">{item.role}</p>
                                        <p className="text-sm font-semibold text-blue-300">{item.company}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-1">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                <p className="mt-6 leading-8 text-slate-300">"{item.quote}"</p>

                                <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
                                    <p className="text-sm opacity-80">Project</p>
                                    <h4 className="mt-1 text-lg font-bold">{item.project}</h4>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-semibold">{item.result}</span>
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid gap-6 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-10 text-white md:grid-cols-4"
                >
                    <div className="text-center">
                        <h3 className="text-5xl font-black">98%</h3>
                        <p className="mt-3 text-blue-100">Organization Satisfaction</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-5xl font-black">50+</h3>
                        <p className="mt-3 text-blue-100">Successful Projects</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-5xl font-black">95%</h3>
                        <p className="mt-3 text-blue-100">Repeat Clients</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-5xl font-black">24/7</h3>
                        <p className="mt-3 text-blue-100">Dedicated Support</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}