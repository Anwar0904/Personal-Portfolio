"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Camera, Coffee, Users, Sparkles } from "lucide-react";

const gallery = [
    {
        title: "Strategy Workshop",
        category: "Collaboration",
        image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
        size: "large",
    },
    {
        title: "Product Design",
        category: "UI / UX",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
        size: "small",
    },
    {
        title: "Engineering Sprint",
        category: "Development",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
        size: "small",
    },
    {
        title: "Creative Session",
        category: "Brainstorming",
        image:
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
        size: "large",
    },
    {
        title: "Coffee & Ideas",
        category: "Culture",
        image:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80",
        size: "wide",
    },
];

const highlights = [
    {
        icon: Users,
        title: "Cross-functional Teams",
        desc: "Designers, engineers and AI specialists work together from day one.",
    },
    {
        icon: Sparkles,
        title: "Innovation Culture",
        desc: "Every week is dedicated to experimentation and product innovation.",
    },
    {
        icon: Coffee,
        title: "Healthy Environment",
        desc: "Balanced work, learning sessions and collaborative workshops.",
    },
];

export default function BehindScenesSection() {
    return (
        <section className="relative overflow-hidden bg-slate-50 py-28">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
                <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[140px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Behind The Scenes
                    </span>

                    <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 lg:text-6xl">
                        Where Great Ideas
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Become Reality
                        </span>
                    </h2>

                    <p className="mt-8 text-lg leading-9 text-slate-600">
                        A glimpse into our daily workflow, collaborative culture and
                        the people building exceptional digital products.
                    </p>
                </motion.div>

                {/* Gallery */}

                <div className="grid gap-6 lg:grid-cols-12 auto-rows-[220px]">

                    {gallery.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: .96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * .08 }}
                            whileHover={{ y: -8 }}
                            className={`group relative overflow-hidden rounded-[30px]
              ${item.size === "large"
                                    ? "lg:col-span-6 lg:row-span-2"
                                    : item.size === "wide"
                                        ? "lg:col-span-12"
                                        : "lg:col-span-3"
                                }`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent opacity-80" />

                            {/* Play Button */}

                            {item.size === "large" && (
                                <div className="absolute inset-0 flex items-center justify-center">

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: .95 }}
                                        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl"
                                    >
                                        <Play
                                            className="ml-1 text-white"
                                            fill="white"
                                            size={34}
                                        />
                                    </motion.button>

                                </div>
                            )}

                            <div className="absolute left-7 right-7 bottom-7">

                                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xl">
                                    {item.category}
                                </span>

                                <h3 className="mt-4 text-2xl font-black text-white">
                                    {item.title}
                                </h3>

                            </div>

                        </motion.div>
                    ))}

                </div>

                {/* Bottom */}

                <div className="mt-24 grid gap-8 lg:grid-cols-3">

                    {highlights.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * .12 }}
                                whileHover={{ y: -8 }}
                                className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500">

                                    <Icon className="text-white" size={30} />

                                </div>

                                <h3 className="text-2xl font-black text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-5 leading-8 text-slate-600">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}

                </div>

                {/* Gallery CTA */}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 flex justify-center"
                >
                    <button className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-600">
                        <Camera size={20} />
                        Explore Our Culture Gallery
                    </button>
                </motion.div>

            </div>
        </section>
    );
}