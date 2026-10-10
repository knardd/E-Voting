import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AOS from "aos";
import { CheckCircle2, ShieldCheck, ArrowRight, Vote, Sparkles } from "lucide-react";

export default function VoteSuccess({ candidate }) {
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        AOS.refresh();

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.visit("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleManualBack = () => {
        router.visit("/");
    };

    const formattedNum =
        candidate?.candidate_number
            ? candidate.candidate_number < 10
                ? `0${candidate.candidate_number}`
                : `${candidate.candidate_number}`
            : null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between p-4 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
            <Head title="Hak Suara Berhasil Direkam - E-Voting" />

            {/* Header with AOS */}
            <header data-aos="fade-down" className="max-w-md w-full mx-auto text-center pt-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pemilihan Ketua & Wakil OSIS</span>
                </div>
            </header>

            {/* Main Success Card with AOS */}
            <main className="max-w-md w-full mx-auto my-auto py-6">
                <div
                    data-aos="zoom-in"
                    data-aos-duration="600"
                    className="bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-blue-500/5 p-6 sm:p-8 text-center space-y-6"
                >
                    {/* Success Animated Icon */}
                    <div className="flex justify-center" data-aos="zoom-in" data-aos-delay="150">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border-2 border-emerald-200/80 shadow-md shadow-emerald-500/10 animate-bounce duration-1000">
                            <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
                        </div>
                    </div>

                    <div className="space-y-1.5" data-aos="fade-up" data-aos-delay="250">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Suara Sah Telah Tercatat
                        </span>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Terima Kasih Atas Partisipasi Anda!
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                            Suara Anda telah dihitung ke dalam tabulasi sistem secara aman dan rahasia.
                        </p>
                    </div>

                    {candidate && (
                        <div
                            data-aos="fade-up"
                            data-aos-delay="350"
                            className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/90 space-y-1"
                        >
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                                Pasangan Calon Yang Dipilih {formattedNum ? `(#${formattedNum})` : ""}
                            </span>
                            <p className="text-base font-extrabold text-slate-900">
                                {candidate.name}
                            </p>
                        </div>
                    )}

                    {/* Auto Reset Timer Box */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="450"
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2"
                    >
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                <span>Bilik suara akan direset:</span>
                            </span>
                            <span className="font-mono text-sm font-bold text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                                {countdown} Detik
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(countdown / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="500">
                        <button
                            onClick={handleManualBack}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] text-xs sm:text-sm cursor-pointer"
                        >
                            <span>Kembali ke Layar Standby</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-400 py-4">
                <p>E-Voting OSIS • Asas Langsung, Umum, Bebas, Rahasia, Jujur & Adil</p>
            </footer>
        </div>
    );
}
