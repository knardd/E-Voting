import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AOS from "aos";
import {
    Vote,
    ShieldCheck,
    Lock,
    FileText,
    CheckCircle2,
    LogOut,
    Sparkles,
    AlertCircle,
    X,
    ChevronDown,
    Quote,
    Award,
    User,
    ArrowDownCircle,
} from "lucide-react";

export default function CandidateList({ candidates = [], voter = null }) {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        AOS.refresh();
    }, [candidates]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80;
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const handleOpenConfirm = (candidate) => {
        setSelectedCandidate(candidate);
    };

    const handleCloseConfirm = () => {
        if (!isSubmitting) {
            setSelectedCandidate(null);
        }
    };

    const handleConfirmVote = () => {
        if (!selectedCandidate || isSubmitting) return;
        setIsSubmitting(true);
        router.post(
            "/vote",
            {
                candidate_id: selectedCandidate.id,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleCancelBooth = () => {
        if (
            confirm(
                "Apakah Anda yakin ingin membatalkan sesi bilik suara dan kembali ke layar awal?",
            )
        ) {
            router.post("/booth/cancel");
        }
    };

    const rules = [
        {
            icon: Lock,
            title: "Pilihan Bersifat Final",
            desc: "Suara yang telah dikonfirmasi tersimpan secara permanen dan tidak dapat diubah kembali.",
        },
        {
            icon: Vote,
            title: "Satu Hak Suara",
            desc: "Setiap kartu / token pemilih hanya berhak memberikan 1 (satu) suara sah.",
        },
        {
            icon: FileText,
            title: "Pelajari Visi & Misi",
            desc: "Pahami arah program kerja setiap pasangan calon sebelum menentukan pilihan terbaik.",
        },
        {
            icon: ShieldCheck,
            title: "Kerahasiaan Terjamin",
            desc: "Pilihan Anda dijamin kerahasiaannya dan tidak terhubung dengan identitas pemilih.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
            <Head title="Bilik Suara - Pilih Pasangan Calon OSIS" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                            <Vote className="w-4 h-4" strokeWidth={2.2} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block leading-none">
                                Bilik Suara Aktif
                            </span>
                            <h1 className="text-sm font-bold text-slate-900 leading-tight">
                                Pemilihan Ketua & Wakil OSIS
                            </h1>
                        </div>
                    </div>

                    {/* Active Voter Identity & Exit Button */}
                    <div className="flex items-center gap-3">
                        {voter && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-slate-500 hidden sm:inline">
                                    Pemilih:
                                </span>
                                <span className="font-bold text-slate-900">
                                    {voter.name}
                                </span>
                                {voter.class_dept && (
                                    <span className="text-blue-600 font-semibold bg-blue-100/60 px-1.5 py-0.5 rounded text-[10px]">
                                        {voter.class_dept}
                                    </span>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleCancelBooth}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all"
                            title="Batalkan dan keluar dari bilik suara"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                                Batal / Keluar
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1">
                {/* Hero Section with AOS */}
                <section className="pt-12 pb-14 sm:pt-20 sm:pb-20 bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-slate-50 border-b border-slate-200/60 text-center px-4">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div
                            data-aos="fade-down"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Masa Bakti 2026 / 2027</span>
                        </div>

                        <h2
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                        >
                            Tentukan Masa Depan OSIS
                        </h2>

                        <p
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="text-xs sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed"
                        >
                            Simak visi dan misi masing-masing pasangan calon di
                            bawah ini, lalu gunakan hak suara Anda pada bilik
                            coblos digital.
                        </p>

                        <div
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="pt-3 flex flex-wrap items-center justify-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("profil-kandidat")
                                }
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                            >
                                <span>Lihat Visi & Misi</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection("bilik-coblos")}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                            >
                                <Vote className="w-4 h-4" />
                                <span>Bilik Coblos (Pilih)</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Rules Strip with AOS */}
                <section className="py-12 px-4 bg-white border-b border-slate-200/60">
                    <div className="max-w-6xl mx-auto">
                        <div
                            data-aos="fade-up"
                            className="text-center max-w-xl mx-auto mb-8"
                        >
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                                Petunjuk & Ketentuan
                            </span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                Aturan Pemungutan Suara
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {rules.map((rule, idx) => {
                                const IconComp = rule.icon;
                                return (
                                    <div
                                        key={idx}
                                        data-aos="fade-up"
                                        data-aos-delay={idx * 100}
                                        className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-blue-300 hover:bg-white transition-all duration-300 flex flex-col gap-2 shadow-2xs"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <IconComp className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                            {rule.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {rule.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Candidate Detail Cards Showcase with Alternating AOS */}
                <section
                    id="profil-kandidat"
                    className="py-16 sm:py-24 px-4 overflow-hidden scroll-mt-16"
                >
                    <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
                        <div
                            data-aos="fade-up"
                            className="text-center space-y-1.5 max-w-xl mx-auto"
                        >
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
                                Profil Calon Pemimpin
                            </span>
                            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Gagasan & Program Paslon
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400">
                                Kenali profil dan komitmen kerja masing-masing
                                pasangan calon.
                            </p>
                        </div>

                        <div className="space-y-16 sm:space-y-24">
                            {candidates.map((cand, index) => {
                                const isEven = index % 2 === 1;
                                const formattedNum =
                                    cand.candidate_number < 10
                                        ? `0${cand.candidate_number}`
                                        : `${cand.candidate_number}`;

                                return (
                                    <div
                                        key={cand.id}
                                        data-aos={
                                            isEven ? "fade-left" : "fade-right"
                                        }
                                        data-aos-duration="800"
                                        className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row gap-8 sm:gap-12 items-center relative overflow-hidden ${
                                            isEven ? "md:flex-row-reverse" : ""
                                        }`}
                                    >
                                        {/* Big Watermark Number */}
                                        <span className="absolute right-6 top-3 select-none font-mono font-black text-8xl text-slate-900/[0.03] pointer-events-none">
                                            #{formattedNum}
                                        </span>

                                        {/* Photo Column */}
                                        <div className="w-full md:w-5/12 shrink-0">
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group">
                                                {cand.photo ? (
                                                    <img
                                                        src={`/storage/${cand.photo}`}
                                                        alt={cand.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                                        <User className="w-16 h-16 mb-2" />
                                                        <span className="text-xs font-semibold text-slate-400">
                                                            Foto Resmi Paslon
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Number Badge */}
                                                <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5">
                                                    <span>#{formattedNum}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="w-full md:w-7/12 space-y-5">
                                            <div>
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                                                    <Award className="w-3.5 h-3.5" />
                                                    <span>
                                                        Pasangan Calon #
                                                        {formattedNum}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                                    {cand.name}
                                                </h4>
                                            </div>

                                            {/* Visi */}
                                            <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100/80 relative">
                                                <Quote className="w-4 h-4 text-blue-300 absolute right-3 top-3" />
                                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                                                    Visi Utama
                                                </span>
                                                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                                                    "{cand.visi}"
                                                </p>
                                            </div>

                                            {/* Misi */}
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Misi & Program Kerja
                                                </span>
                                                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                                                    {cand.misi
                                                        .split("\n")
                                                        .filter((m) => m.trim())
                                                        .map((item, mIdx) => (
                                                            <li
                                                                key={mIdx}
                                                                className="flex items-start gap-2.5"
                                                            >
                                                                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                                                                    {mIdx + 1}
                                                                </span>
                                                                <span className="leading-relaxed">
                                                                    {item.replace(
                                                                        /^\d+[\.\)]\s*/,
                                                                        "",
                                                                    )}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Voting Ballot Box Section with AOS */}
                <section
                    id="bilik-coblos"
                    className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white via-blue-50/30 to-slate-50 border-t border-slate-200/80 scroll-mt-16"
                >
                    <div className="max-w-5xl mx-auto space-y-10">
                        <div
                            data-aos="fade-up"
                            className="text-center space-y-2 max-w-xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                                <Vote className="w-3.5 h-3.5 text-blue-600" />
                                <span>Kotak Suara Digital</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Berikan Suara Anda
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Klik tombol <strong>"Coblos Paslon Ini"</strong>{" "}
                                pada kandidat pilihan Anda untuk merekam suara
                                Anda.
                            </p>
                        </div>

                        {/* Ballot Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidates.map((cand, index) => {
                                const formattedNum =
                                    cand.candidate_number < 10
                                        ? `0${cand.candidate_number}`
                                        : `${cand.candidate_number}`;

                                return (
                                    <div
                                        key={cand.id}
                                        data-aos="zoom-in"
                                        data-aos-delay={index * 150}
                                        className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between group"
                                    >
                                        <div className="space-y-4">
                                            {/* Photo */}
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/70">
                                                {cand.photo ? (
                                                    <img
                                                        src={`/storage/${cand.photo}`}
                                                        alt={cand.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <User className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                                                    #{formattedNum}
                                                </div>
                                            </div>

                                            {/* Text info */}
                                            <div className="text-center space-y-1">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                                                    Pasangan Calon #
                                                    {formattedNum}
                                                </span>
                                                <h4 className="text-base font-bold text-slate-900 leading-snug">
                                                    {cand.name}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 line-clamp-2 italic pt-1">
                                                    "{cand.visi}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-6">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenConfirm(cand)
                                                }
                                                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <Vote className="w-4 h-4" />
                                                <span>
                                                    Coblos Paslon #
                                                    {formattedNum}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Minimal Footer */}
            <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
                    <p>© 2026 Panitia Pemilihan Ketua & Wakil OSIS</p>
                </div>
            </footer>

            {/* Modal Konfirmasi Pilihan Suara */}
            {selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                        onClick={handleCloseConfirm}
                    />

                    {/* Dialog Box */}
                    <div
                        data-aos="zoom-in"
                        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Vote className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Konfirmasi Pilihan Suara
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseConfirm}
                                disabled={isSubmitting}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 text-center">
                            <div className="w-24 h-24 rounded-2xl mx-auto overflow-hidden border-2 border-blue-600 shadow-md bg-slate-100">
                                {selectedCandidate.photo ? (
                                    <img
                                        src={`/storage/${selectedCandidate.photo}`}
                                        alt={selectedCandidate.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                                    Pasangan Calon #
                                    {selectedCandidate.candidate_number}
                                </span>
                                <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                                    {selectedCandidate.name}
                                </h4>
                            </div>

                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-left flex items-start gap-2.5 text-xs text-amber-800">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">
                                    Pilihan suara yang dikonfirmasi bersifat{" "}
                                    <strong>permanen</strong> dan sesi bilik
                                    suara Anda akan langsung diselesaikan.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2.5">
                            <button
                                type="button"
                                onClick={handleCloseConfirm}
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmVote}
                                disabled={isSubmitting}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                    {isSubmitting
                                        ? "Mencatat Suara..."
                                        : "Ya, Coblos Paslon"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
