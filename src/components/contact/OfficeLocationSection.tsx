"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    MapPin,
    Phone,
    Mail,
    Clock3,
    Navigation,
    ArrowUpRight,
} from "lucide-react";

const officeInfo = {
    city: "Chakdara",
    region: "District Malakand, Khyber Pakhtunkhwa",
    country: "Pakistan",

    address:
        "Main Chakdara, District Malakand, Khyber Pakhtunkhwa, Pakistan",

    phone: "+92 300 1234567",

    email: "hello@arazidigitalmedia.com",

    hours: [
        "Monday – Friday",
        "09:00 AM – 06:00 PM (PKT)",
    ],
};

export default function OfficeLocationSection() {
    return (
        <section
            id="location"
            className="relative overflow-hidden bg-slate-950 py-24 lg:py-32"
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 to-slate-900" />

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <motion.div
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
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Visit Our Office
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-white lg:text-6xl">
                        Meet Us In
                        <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Chakdara
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-300">
                        Whether you want a face-to-face consultation or simply wish to learn more about ADM, you're always welcome.
                    </p>
                </motion.div>

                <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
                    {/* Information Card */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="rounded-[36px] border border-slate-800 bg-slate-900/80 p-10 shadow-xl"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white">
                            <MapPin size={38} />
                        </div>

                        <h3 className="mt-8 text-3xl font-black text-white">ADM Headquarters</h3>
                        <p className="mt-3 font-semibold text-blue-300">{officeInfo.city}, {officeInfo.region}</p>

                        <div className="mt-10 space-y-8">
                            {/* Address */}

                            <div className="flex items-start gap-5">
                                <MapPin
                                    size={24}
                                    className="mt-1 text-blue-600"
                                />

                                <div>
                                    <h4 className="font-bold text-white">Address</h4>
                                    <p className="mt-2 leading-8 text-slate-300">{officeInfo.address}</p>
                                </div>
                            </div>

                            {/* Phone */}

                            <div className="flex items-start gap-5">
                                <Phone
                                    size={24}
                                    className="mt-1 text-blue-600"
                                />

                                <div>
                                    <h4 className="font-bold text-white">Phone</h4>
                                    <Link href={`tel:${officeInfo.phone}`} className="mt-2 block text-slate-300 hover:text-blue-300">
                                        {officeInfo.phone}
                                    </Link>
                                </div>
                            </div>

                            {/* Email */}

                            <div className="flex items-start gap-5">
                                <Mail
                                    size={24}
                                    className="mt-1 text-blue-600"
                                />

                                <div>
                                    <h4 className="font-bold text-white">Email</h4>
                                    <Link href={`mailto:${officeInfo.email}`} className="mt-2 block text-slate-300 hover:text-blue-300">
                                        {officeInfo.email}
                                    </Link>
                                </div>
                            </div>

                            {/* Hours */}

                            <div className="flex items-start gap-5">
                                <Clock3
                                    size={24}
                                    className="mt-1 text-blue-600"
                                />

                                <div>
                                    <h4 className="font-bold text-white">Working Hours</h4>
                                    <p className="mt-2 leading-8 text-slate-300">{officeInfo.hours[0]}<br />{officeInfo.hours[1]}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="https://www.google.com/maps/place/Duaa+Boys+Hostel/@34.667079,72.0653084,327m/data=!3m1!1e3!4m15!1m8!3m7!1s0x38dc06b2f81bf501:0x4c8e27508a99b797!2sChakdara,+Pakistan!3b1!8m2!3d34.6665626!4d72.0290387!16zL20vMDlsbDE0!3m5!1s0x38dc04120f16c13f:0xdb556dc3aff1f65!8m2!3d34.6672203!4d72.0654008!16s%2Fg%2F11dy78b1pz!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            className="mt-10 inline-flex items-center rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Open in Google Maps

                            <ArrowUpRight
                                size={18}
                                className="ml-3"
                            />
                        </Link>
                    </motion.div>

                    {/* Map */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="overflow-hidden rounded-[36px] border border-slate-200 shadow-xl"
                    >
                        <iframe
                            title="ADM Office Location"
                            src="https://www.google.com/maps?q=Chakdara,Malakand,Pakistan&z=14&output=embed"
                            className="h-[650px] w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </div>

                {/* Bottom Card */}

                <motion.div
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
                    className="mt-16 rounded-[32px] border border-blue-500/20 bg-gradient-to-r from-blue-950/80 to-slate-900 p-10"
                >
                    <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
                        <div>
                            <h3 className="text-3xl font-black text-white">Prefer an Online Meeting?</h3>
                            <p className="mt-4 max-w-2xl leading-8 text-slate-300">We work with clients worldwide. If visiting our office isn't convenient, schedule a free video consultation with our experts.</p>
                        </div>

                        <Link
                            href="#contact-form"
                            className="inline-flex items-center rounded-2xl bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Navigation
                                size={18}
                                className="mr-3"
                            />

                            Book Virtual Meeting
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}