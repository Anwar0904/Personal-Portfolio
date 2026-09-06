"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

type LoginResponse = {
    success?: boolean;
    message?: string;
    data?: {
        user?: {
            _id?: string;
            name?: string;
            email?: string;
            role?: unknown;
        };
        tokens?: {
            accessToken?: string;
            refreshToken?: string;
        };
    };
};

export default function AdminLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const result: LoginResponse =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Unable to sign in. Please check your credentials."
                );
            }

            if (result?.data?.user) {
                sessionStorage.setItem(
                    "adm_user",
                    JSON.stringify(
                        result.data.user
                    )
                );
            }

            router.replace(
                "/admin/dashboard"
            );

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-50">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-200/20 blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
                <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.10)] lg:grid-cols-[1fr_.95fr]">
                    {/* Brand panel */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -30,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:min-h-[560px] lg:flex-col lg:justify-between"
                    >
                        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

                        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                        <div className="relative">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
                                    A
                                </span>

                                <div>
                                    <span className="block text-base font-black tracking-tight">
                                        ADM
                                    </span>

                                    <span className="block text-[11px] text-slate-400">
                                        Arazi Digital Media
                                    </span>
                                </div>
                            </Link>

                            <div className="mt-14 max-w-lg">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-blue-300">
                                    <Sparkles
                                        size={14}
                                    />

                                    ADM Control Center
                                </div>

                                <h1 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">
                                    Build.
                                    <br />
                                    Manage.
                                    <br />
                                    <span className="text-blue-500">
                                        Grow.
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                                    Manage your digital
                                    ecosystem, content,
                                    clients, projects, and
                                    team from one secure
                                    workspace.
                                </p>
                            </div>
                        </div>

                        <div className="relative flex items-center gap-4 border-t border-white/10 pt-6 text-sm text-slate-400">
                            <ShieldCheck
                                size={20}
                                className="text-blue-500"
                            />

                            <span>
                                Secure ADM administration
                                portal
                            </span>
                        </div>
                    </motion.div>

                    {/* Login panel */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 30,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.1,
                        }}
                        className="flex min-h-[560px] items-center p-5 sm:p-8 lg:p-10"
                    >
                        <div className="mx-auto w-full max-w-md">
                            {/* Mobile logo */}

                            <div className="mb-7 lg:hidden">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-3"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
                                        A
                                    </span>

                                    <div>
                                        <span className="block font-black text-slate-900">
                                            ADM
                                        </span>

                                        <span className="block text-xs text-slate-500">
                                            Admin Portal
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Heading */}

                            <div>
                                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                    Welcome Back
                                </span>

                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                    Sign in to ADM
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Access your ADM
                                    administration
                                    workspace.
                                </p>
                            </div>

                            {/* Error */}

                            {error && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                                    role="alert"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Form */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="mt-6 space-y-4"
                            >
                                {/* Email */}

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={
                                                19
                                            }
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={
                                                email
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEmail(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="admin@adm.com"
                                            required
                                            disabled={
                                                loading
                                            }
                                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                {/* Password */}

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            href="/admin/forgot-password"
                                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={
                                                19
                                            }
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="current-password"
                                            value={
                                                password
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPassword(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter your password"
                                            required
                                            disabled={
                                                loading
                                            }
                                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) =>
                                                        !value
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={
                                                        19
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        19
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in

                                            <ArrowRight
                                                size={
                                                    19
                                                }
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Security note */}

                            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                                <ShieldCheck
                                    size={19}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <p className="text-xs leading-5 text-slate-500">
                                    Your account is protected
                                    by ADM's authentication
                                    and session system.
                                </p>
                            </div>

                            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.16em] text-slate-400">
                                ADM Admin Portal
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}