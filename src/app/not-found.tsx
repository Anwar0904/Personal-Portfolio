import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-black text-white drop-shadow-lg">404</h1>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1"
                        >
                            <ArrowLeft size={18} />
                            Back to Home
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20"
                        >
                            Contact Support
                        </Link>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
                        <Link
                            href="/services"
                            className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                        >
                            <h3 className="font-bold text-white mb-2">Our Capabilities</h3>
                            <p className="text-sm text-slate-300">Explore our services and solutions</p>
                        </Link>

                        <Link
                            href="/portfolio"
                            className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                        >
                            <h3 className="font-bold text-white mb-2">Portfolio</h3>
                            <p className="text-sm text-slate-300">See our recent work and projects</p>
                        </Link>

                        <Link
                            href="/blogs"
                            className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                        >
                            <h3 className="font-bold text-white mb-2">Insights</h3>
                            <p className="text-sm text-slate-300">Read our latest articles and tips</p>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
