"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    HeartPulse,
    GraduationCap,
    Landmark,
    ShoppingCart,
    Truck,
    Building2,
    Factory,
    Cpu,
} from "lucide-react";

const industries = [
    { title: "Healthcare", slug: "healthcare", description: "AI-powered healthcare platforms, patient management systems and secure medical solutions.", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80", icon: HeartPulse, services: 8, color: "from-blue-600 to-cyan-500", tags: ["AI", "Cloud", "HIPAA"] },
    { title: "Education", slug: "education", description: "Modern LMS platforms, virtual classrooms and AI learning assistants.", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80", icon: GraduationCap, services: 6, color: "from-indigo-600 to-blue-500", tags: ["LMS", "AI", "Analytics"] },
    { title: "Finance", slug: "finance", description: "Secure fintech applications, payment systems and financial automation.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80", icon: Landmark, services: 10, color: "from-blue-700 to-sky-500", tags: ["FinTech", "Security", "Automation"] },
    { title: "E-Commerce", slug: "ecommerce", description: "Scalable online stores, AI recommendations and customer engagement.", image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900&q=80", icon: ShoppingCart, services: 9, color: "from-cyan-600 to-blue-600", tags: ["Next.js", "Payments", "AI"] },
    { title: "Logistics", slug: "logistics", description: "Fleet management, warehouse automation and supply-chain intelligence.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80", icon: Truck, services: 7, color: "from-sky-600 to-blue-600", tags: ["Tracking", "IoT", "Automation"] },
    { title: "Real Estate", slug: "real-estate", description: "Property portals, CRM solutions and intelligent real-estate systems.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80", icon: Building2, services: 6, color: "from-blue-500 to-indigo-600", tags: ["CRM", "Portal", "Maps"] },
    { title: "Manufacturing", slug: "manufacturing", description: "Smart factories powered by AI, IoT and predictive analytics.", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&q=80", icon: Factory, services: 8, color: "from-cyan-700 to-blue-700", tags: ["IoT", "AI", "ERP"] },
    { title: "Technology", slug: "technology", description: "Enterprise SaaS platforms, cloud-native architecture and AI products.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80", icon: Cpu, services: 12, color: "from-indigo-600 to-cyan-500", tags: ["Cloud", "SaaS", "DevOps"] },
];

export default function IndustriesGrid() {
    return (
        <section className="bg-slate-950 py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Industries We Empower
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
                        Tailored Digital Solutions
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            For Every Industry
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        Every industry requires unique technology, security and customer experience.
                        ADM delivers purpose-built digital ecosystems for businesses of every scale.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                    {industries.map((industry, index) => {
                        const Icon = industry.icon;

                        return (
                            <motion.div
                                key={industry.slug}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                viewport={{ once: true }}
                                className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-[0_20px_60px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-3 hover:border-blue-400/50 hover:shadow-[0_30px_80px_rgba(59,130,246,.2)]"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image src={industry.image} alt={industry.title} fill className="object-cover transition duration-700 group-hover:scale-110" />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${industry.color} opacity-75`} />
                                    <div className="absolute left-6 top-6 rounded-2xl bg-slate-900/35 p-4 backdrop-blur-xl">
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute bottom-6 left-6">
                                        <h3 className="text-2xl font-bold text-white">{industry.title}</h3>
                                        <p className="mt-2 text-white/90">{industry.services} Solutions</p>
                                    </div>
                                </div>

                                <div className="p-7">
                                    <p className="leading-7 text-slate-300">{industry.description}</p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {industry.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition group-hover:border-blue-400/50 group-hover:bg-blue-500/10 group-hover:text-blue-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={`/industries/${industry.slug}`} className="mt-8 inline-flex items-center font-semibold text-blue-300">
                                        Explore Industry
                                        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}