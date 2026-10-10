import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Toaster } from "sonner";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Vote,
    ExternalLink,
    DownloadCloud,
} from "lucide-react";

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const authUser = props.auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/admin/logout");
    };

    const isActive = (path) => url.startsWith(path);

    const navItems = [
        {
            category: "UTAMA",
            items: [
                {
                    label: "Dashboard",
                    href: "/admin/dashboard",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            category: "MANAJEMEN DATA",
            items: [
                {
                    label: "Data Pasangan Calon",
                    href: "/admin/candidates",
                    icon: UserCheck,
                },
                {
                    label: "Daftar Pemilih (DPT)",
                    href: "/admin/voters",
                    icon: Users,
                },
            ],
        },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            {/* Brand Header */}
            <div className="px-6 py-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/25">
                        <Vote
                            className="w-5 h-5 text-white"
                            strokeWidth={2.2}
                        />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">
                            E-Voting OSIS
                        </h2>
                        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                            Panel Administrator
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3.5 pt-5 pb-4 space-y-6 overflow-y-auto">
                {navItems.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                        <span className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            {group.category}
                        </span>
                        {group.items.map((item, idx) => {
                            const active = isActive(item.href);
                            const ItemIcon = item.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-150 ${
                                        active
                                            ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                                    }`}
                                >
                                    <ItemIcon
                                        className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                                            active
                                                ? "text-white"
                                                : "text-slate-400 group-hover:text-blue-600"
                                        }`}
                                        strokeWidth={active ? 2.2 : 2}
                                    />
                                    <div className="min-w-0">
                                        <span className="block text-xs leading-snug">
                                            {item.label}
                                        </span>
                                        <span
                                            className={`block text-[10px] leading-tight mt-0.5 ${
                                                active
                                                    ? "text-blue-100 font-normal"
                                                    : "text-slate-400 group-hover:text-slate-500 font-normal"
                                            }`}
                                        >
                                            {item.description}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ))}

                {/* Quick Link to Booth */}
                <div className="pt-2 px-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <Vote className="w-3.5 h-3.5" />
                            <span>Buka Layar Bilik Suara</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </nav>

            {/* Footer User Info & Logout */}
            <div className="mt-auto p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                            {authUser?.name ||
                                authUser?.username ||
                                "Administrator"}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            Hak Akses Admin
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-xs font-bold transition-all shadow-2xs"
                >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Keluar dari Panel</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white">
            <Toaster position="top-right" richColors theme="light" />

            {/* Mobile Top Navbar */}
            <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
                        <Vote className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 leading-tight">
                            E-Voting
                        </h1>
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
                    aria-label="Toggle Navigation"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Desktop */}
            <aside
                className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-300 ease-in-out shadow-xs ${
                    isMobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Main Content Viewport */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
