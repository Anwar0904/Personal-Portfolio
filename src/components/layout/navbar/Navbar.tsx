"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navigation, type NavigationChild } from "./menu";
import { profile } from "@/config/profile";

function NavLogo({ compact = false }: { compact?: boolean }) {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2"
        >
            <div className="flex items-center gap-2">
                <div className={`brand-gradient relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-brand transition-all duration-300 group-hover:-translate-y-0.5 ${compact ? "h-6 w-6 sm:h-7 sm:w-7" : "h-7 w-7 sm:h-9 sm:w-9"}`}>
                    <div className="absolute inset-0 bg-white/10" />

                    <img
                        src="/logo.png"
                        alt={`${profile.name} logo`}
                        className={`relative object-contain ${compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-7 w-7 sm:h-7 sm:w-7"}`}
                    />
                </div>

                <div className="leading-none">
                    <h1 className={`font-black tracking-tight text-text transition-all duration-300 ${compact ? "text-base sm:text-base" : "text-lg sm:text-lg"}`}>
                        {profile.shortName}
                    </h1>
                    <p className={`mt-1.5 font-semibold uppercase tracking-[0.18em] text-text-soft transition-all duration-300 ${compact ? "text-[7px]" : "text-[8px] sm:text-[7px]"}`}>
                        {profile.title}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function MegaMenu({ items }: { items: NavigationChild[] }) {
    return (
        <div className="absolute left-1/2 top-full hidden w-[31rem] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_60px_rgba(2,6,23,0.5)] backdrop-blur-md group-hover:block">
            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex gap-4 rounded-xl border border-transparent p-4 transition hover:border-blue-400/30 hover:bg-blue-500/10"
                        >
                            <Icon className="mt-1 h-5 w-5 text-cyan-300" />

                            <div>
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 18);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const closeMenu = () => {
        setOpen(false);
        setServicesOpen(false);
    };

    return (
        <header className={`site-nav sticky top-0 z-50 w-full bg-slate-950/60 transition-all duration-300 ${scrolled ? "shadow-[0_20px_50px_rgba(8,15,30,0.45)] backdrop-blur-md" : "shadow-none"}`}>
            <div className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-5 lg:px-8 ${scrolled ? "h-13 sm:h-16 lg:h-14" : "h-16 sm:h-14 lg:h-16"}`}>
                <div className="shrink-0">
                    <NavLogo compact={scrolled} />
                </div>

                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-5 lg:flex xl:gap-7"
                >
                    {navigation.map((item) => {
                        const hasMegaMenu = "mega" in item && item.mega;

                        return (
                            <div
                                key={item.title}
                                className="group relative flex h-20 items-center"
                            >
                                {hasMegaMenu ? (
                                    <>
                                        <Link
                                            href={item.href ?? "#"}
                                            className="site-nav-link flex items-center gap-1.5"
                                        >
                                            <span>{item.title}</span>
                                            <ChevronDown
                                                size={15}
                                                strokeWidth={2}
                                                className="transition-transform duration-200 group-hover:rotate-180"
                                            />
                                        </Link>
                                        <MegaMenu items={item.items ?? []} />
                                    </>
                                ) : (
                                    <Link
                                        href={item.href ?? "#"}
                                        className="site-nav-link"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        href="/consultation"
                        className="site-button-primary hidden lg:inline-flex xl:px-5 xl:py-2.5"
                    >
                        Start a conversation
                    </Link>

                    <button
                        type="button"
                        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                        className="relative z-[70] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text shadow-sm transition hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-brand-500/20 lg:hidden"
                    >
                        {open ? <X size={21} strokeWidth={2} /> : <Menu size={21} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                        className="absolute inset-0 bg-slate-950/30"
                    />

                    <div className="absolute inset-x-0 top-0 flex h-screen flex-col bg-surface shadow-2xl">
                        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-5 sm:px-6">
                            <Link href="/" onClick={closeMenu} className="text-lg font-bold text-text">
                                {profile.shortName}
                            </Link>

                            <button
                                type="button"
                                aria-label="Close navigation"
                                onClick={closeMenu}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition hover:bg-surface-alt"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const isMega = "mega" in item && item.mega;

                                    if (isMega) {
                                        return (
                                            <div key={item.title}>
                                                <div className="flex items-center">
                                                    <Link
                                                        href={item.href!}
                                                        onClick={closeMenu}
                                                        className="flex min-h-12 flex-1 items-center rounded-xl px-3 text-base font-semibold text-text transition hover:bg-surface-alt"
                                                    >
                                                        {item.title}
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        aria-label="Toggle services"
                                                        aria-expanded={servicesOpen}
                                                        onClick={() => setServicesOpen((value) => !value)}
                                                        className="flex h-11 w-11 items-center justify-center rounded-xl text-text-soft transition hover:bg-surface-alt"
                                                    >
                                                        <ChevronDown
                                                            size={19}
                                                            className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                                                        />
                                                    </button>
                                                </div>

                                                {servicesOpen && (
                                                    <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                                                        {item.items?.map((child) => {
                                                            const Icon = child.icon;

                                                            return (
                                                                <Link
                                                                    key={child.href}
                                                                    href={child.href}
                                                                    onClick={closeMenu}
                                                                    className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:border hover:border-blue-400/30 hover:bg-blue-500/10"
                                                                >
                                                                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-cyan-300">
                                                                        {Icon && <Icon size={17} />}
                                                                    </span>

                                                                    <span className="min-w-0">
                                                                        <span className="block text-sm font-semibold text-white">{child.title}</span>
                                                                        {child.description && (
                                                                            <span className="mt-0.5 block text-xs leading-5 text-slate-300">
                                                                                {child.description}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href!}
                                            onClick={closeMenu}
                                            className="site-nav-link flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-text transition hover:bg-surface-alt"
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="mt-6 border-t border-border pt-6">
                                <Link
                                    href="/consultation"
                                    onClick={closeMenu}
                                    className="site-button-primary flex h-12 w-full"
                                >
                                    Start a conversation
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}