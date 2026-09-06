"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    Clock3,
    ArrowRight,
    Globe,
} from "lucide-react";

const contactMethods = [
    {
        icon: Mail,
        title: "Email Us",
        value: "hello@arazidigitalmedia.com",
        description: "Best for project discussions and proposals.",
        href: "mailto:hello@arazidigitalmedia.com",
        gradient: "from-blue-600 to-cyan-500",
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+92 300 1234567",
        description: "Talk directly with our consulting team.",
        href: "tel:+923001234567",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Globe,
        title: "Online Meeting",
        value: "Book Free Consultation",
        description: "Schedule a strategy session with ADM.",
        href: "#contact-form",
        gradient: "from-violet-600 to-fuchsia-500",
    },
    {
        icon: MapPin,
        title: "Visit Office",
        value: "Islamabad, Pakistan",
        description: "Available by appointment only.",
        href: "#location",
        gradient: "from-orange-500 to-red-500",
    },
];

export default function ContactMethodsSection() {
    return (
        <section className="relative py-24 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[150px]" />
                <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Contact Information
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        Multiple Ways
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            To Reach Us
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-300">
                        Choose the communication method that works best for you. We're always happy to help.
                    </p>
                </div>

                {/* Cards */}

                <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
                    {contactMethods.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -10,
                                }}
                            >
                                <Link
                                    href={item.href}
                                    className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900/70 p-8 shadow-sm transition-all duration-500 hover:border-blue-400/50 hover:shadow-2xl"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition duration-500 group-hover:opacity-100`} />

                                    <div className="relative z-10">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800 transition-all duration-500 group-hover:bg-white">
                                            <Icon size={36} className="text-blue-300" />
                                        </div>

                                        <h3 className="mt-8 text-2xl font-black text-white transition group-hover:text-white">{item.title}</h3>
                                        <p className="mt-4 font-semibold text-blue-300 transition group-hover:text-cyan-200">{item.value}</p>
                                        <p className="mt-4 leading-8 text-slate-300 transition group-hover:text-white/90">{item.description}</p>

                                        <div className="mt-8 inline-flex items-center font-semibold text-blue-300 transition group-hover:text-white">
                                            Contact
                                            <ArrowRight size={18} className="ml-2 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Info */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 rounded-[32px] border border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-10 lg:p-14"
                >
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="flex items-start gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                <Clock3 size={30} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white">Business Hours</h3>
                                <p className="mt-4 leading-8 text-slate-300">Monday – Friday<br />9:00 AM – 6:00 PM (PKT)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                <MapPin size={30} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white">Headquarters</h3>
                                <p className="mt-4 leading-8 text-slate-300">Islamabad,<br />Pakistan</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}