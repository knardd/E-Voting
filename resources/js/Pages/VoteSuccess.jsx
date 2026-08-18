import React from "react";
import { Head, router } from "@inertiajs/react";
import Icon from "@/Components/Icons";

export default function VoteSuccess({ candidate }) {
    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-600 flex items-center justify-center p-4">
            <Head title="Voting Berhasil" />

            <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl shadow-notion p-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center">
                        <Icon.Check className="w-12 h-12 text-success-hover" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="font-poppins text-3xl font-bold text-slate-900">
                        Voting Berhasil!
                    </h1>
                    <p className="text-slate-500">
                        Terima kasih telah berpartisipasi dalam pemilihan ini.
                    </p>
                </div>

                {candidate && (
                    <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20 space-y-3">
                        <span className="text-xs font-bold text-secondary-text uppercase tracking-widest">
                            Kandidat Terpilih
                        </span>
                        <p className="font-poppins text-xl font-bold text-slate-900">
                            {candidate.name}
                        </p>
                    </div>
                )}

                <div className="bg-success/50 p-4 rounded-lg">
                    <p className="text-sm text-success-hover font-medium">
                        Suara Anda telah direkam dan tidak dapat diubah kembali.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                    Kembali ke Beranda
                </button>

                <p className="text-xs text-slate-450 tracking-widest uppercase">
                    © 2025 E-Voting
                </p>
            </div>
        </div>
    );
}
