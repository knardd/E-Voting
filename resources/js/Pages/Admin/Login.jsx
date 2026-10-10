import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ShieldCheck,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Vote,
    Sparkles,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
            <Head title="Login Administrator - E-Voting OSIS" />

            {/* Top Navigation Bar */}
            <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                            <Vote className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block leading-none">
                                Panel Petugas
                            </span>
                            <h1 className="text-sm font-bold text-slate-900 leading-tight">
                                E-Voting Pemilihan OSIS
                            </h1>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Bilik Suara</span>
                    </Link>
                </div>
            </header>

            {/* Main Form Area */}
            <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
                <div className="w-full max-w-md space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
                            <Lock className="w-7 h-7" strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Login Administrator
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                            Masukkan username dan kata sandi akun panitia untuk mengelola data pemilihan.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
                        {errors.username && (
                            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <span>{errors.username}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                                    Username Admin
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData("username", e.target.value)}
                                        placeholder="admin"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Checkbox */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Ingat Sesi Saya</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>{processing ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Akses terbatas hanya untuk panitia pemilihan resmi</span>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
                <p>© 2026 Panitia Pemilihan Ketua & Wakil OSIS</p>
            </footer>
        </div>
    );
}
