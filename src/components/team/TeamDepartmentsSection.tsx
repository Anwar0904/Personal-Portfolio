"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    Mail,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

type Department =
    | "All"
    | "Engineering"
    | "Design"
    | "AI"
    | "Marketing"
    | "Management";

const departments: Department[] = [
    "All",
    "Engineering",
    "Design",
    "AI",
    "Marketing",
    "Management",
];

const members = [
    {
        id: 1,
        name: "Alex Morgan",
        role: "Senior Full Stack Engineer",
        department: "Engineering",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Lead UI/UX Designer",
        department: "Design",
        image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    },
    {
        id: 3,
        name: "Daniel Kim",
        role: "AI Engineer",
        department: "AI",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    },
    {
        id: 4,
        name: "Emma Wilson",
        role: "Growth Strategist",
        department: "Marketing",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    },
    {
        id: 5,
        name: "Michael Brown",
        role: "Backend Engineer",
        department: "Engineering",
        image:
            "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
    },
    {
        id: 6,
        name: "Sophia Lee",
        role: "Product Designer",
        department: "Design",
        image:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    },
    {
        id: 7,
        name: "James Carter",
        role: "ML Engineer",
        department: "AI",
        image:
            "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&q=80",
    },
    {
        id: 8,
        name: "Olivia White",
        role: "Project Manager",
        department: "Management",
        image:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
    },
];

export default function TeamDepartmentsSection() {
    const [active, setActive] = useState<Department>("All");

    const filtered = useMemo(() => {
        if (active === "All") return members;
        return members.filter((m) => m.department === active);
    }, [active]);

    return (
        <section className="relative overflow-hidden bg-slate-950 py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb12,transparent_35%),radial-gradient(circle_at_bottom_right,#38bdf810,transparent_35%)]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Our Departments
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-5xl">
                        Specialists
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Across Every Discipline
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        Cross-functional collaboration is the core of ADM. Every department works together to deliver exceptional digital products.
                    </p>
                </motion.div>

                {/* Filters */}

                <div className="mt-14 flex flex-wrap justify-center gap-4">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setActive(dept)}
                            className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${active === dept
                                ? "bg-blue-600 text-white shadow-xl"
                                : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400 hover:text-blue-200"
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Cards */}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {filtered.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -12,
                                }}
                                className="group overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900/80 shadow-sm transition-all hover:shadow-2xl"
                            >
                                <div className="relative overflow-hidden">

                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={600}
                                        height={700}
                                        className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                                    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 opacity-0 transition duration-500 group-hover:opacity-100">

                                        {[FaLinkedin, FaGithub, Mail].map((Icon, i) => (
                                            <button
                                                key={i}
                                                className="rounded-full bg-white/20 p-3 text-white backdrop-blur-xl hover:bg-blue-600"
                                            >
                                                <Icon size={18} />
                                            </button>
                                        ))}

                                    </div>

                                </div>

                                <div className="p-7">

                                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
                                        {member.department}
                                    </span>

                                    <h3 className="mt-5 text-2xl font-black text-white">{member.name}</h3>
                                    <p className="mt-2 text-slate-300">{member.role}</p>

                                    <button className="group mt-7 inline-flex items-center font-semibold text-blue-300">
                                        View Profile

                                        <ArrowUpRight
                                            size={18}
                                            className="ml-2 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                                        />
                                    </button>

                                </div>

                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}