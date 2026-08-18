import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import Icon from "@/Components/Icons";

export default function CandidateList({ candidates, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const handleVote = (candidateId) => {
        router.post("/vote", {
            candidate_id: candidateId,
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-600">
            <Head title="Pemilihan Ketua OSIS" />

            {/* Hero Section */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <div data-aos="fade-up" className="max-w-4xl mx-auto">
                    <img
                        src="/storage/osis2.png"
                        className="rounded-full w-20 h-20 mx-auto mb-8 border-2 border-white/20 p-1 bg-white/10"
                        alt="Logo OSIS"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                    <h1 className="font-poppins text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        PEMILIHAN KETUA OSIS
                    </h1>
                    <h2 className="font-poppins text-2xl md:text-3xl font-bold opacity-90 mb-8">
                        MASA BAKTI 2026/2027
                    </h2>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto">
                        Suara Anda Menentukan Masa Depan Sekolah Ini. Pilih
                        Kandidat Secara Bijak.
                    </p>
                </div>
            </div>

            {/* Voting Rules */}
            <div className="py-20 px-4 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <h2
                        data-aos="fade-up"
                        className="font-poppins text-3xl font-bold text-center text-slate-900 mb-12"
                    >
                        Aturan Voting
                    </h2>

                    <div
                        data-aos="fade-up"
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            {
                                Icon: Icon.Lock,
                                title: "Tidak Bisa Diubah",
                                desc: "Voting tidak bisa diubah kembali setelah dikonfirmasi",
                            },
                            {
                                Icon: Icon.Hand,
                                title: "Satu Kali Kesempatan",
                                desc: "Setiap pemilih hanya diberikan satu kali kesempatan",
                            },
                            {
                                Icon: Icon.Document,
                                title: "Baca Visi & Misi",
                                desc: "Pastikan membaca visi misi setiap kandidat",
                            },
                            {
                                Icon: Icon.ShieldCheck,
                                title: "Data Terjaga",
                                desc: "Data Anda akan dijaga kerahasiaannya",
                            },
                        ].map((rule, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-gradient-to-r from-primary to-indigo-600 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
                                    <rule.Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-poppins font-bold text-slate-900 mb-2">
                                    {rule.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {rule.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Candidate List */}
            <div className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div data-aos="fade-up" className="text-center mb-20">
                        <h2 className="font-poppins text-3xl font-bold text-slate-900 mb-4">
                            Pengenalan Kandidat
                        </h2>
                        <p className="text-slate-500">
                            Kenali visi, misi, dan program kerja masing-masing
                            kandidat
                        </p>
                    </div>

                    <div className="space-y-24">
                        {candidates.map((candidate, index) => (
                            <div
                                key={candidate.id}
                                data-aos={
                                    index % 2 === 1 ? "fade-left" : "fade-right"
                                }
                                className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                            >
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] duration-500">
                                        <img
                                            src={`/storage/${candidate.photo}`}
                                            alt={candidate.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold font-poppins">
                                            {index + 1}
                                        </span>
                                        <h3 className="font-poppins text-3xl font-bold text-slate-900">
                                            {candidate.name}
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-poppins font-bold text-primary uppercase tracking-wider text-sm">
                                            Visi
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {candidate.visi}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-poppins font-bold text-primary uppercase tracking-wider text-sm">
                                            Misi
                                        </h4>
                                        <ul className="list-disc pl-5 text-slate-600 space-y-1">
                                            {candidate.misi
                                                .split("\n")
                                                .map(
                                                    (item, i) =>
                                                        item.trim() && (
                                                            <li key={i}>
                                                                {item.trim()}
                                                            </li>
                                                        ),
                                                )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <footer
                data-aos="fade-up"
                className="bg-slate-900 py-20 text-center px-4"
            >
                <div className="max-w-2xl mx-auto space-y-8">
                    <h3 className="font-poppins text-2xl font-bold text-white">
                        Siap memberikan suara Anda?
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20"
                    >
                        Pilih Kandidat Sekarang
                    </button>
                    <p className="text-slate-450 text-sm italic">
                        Partisipasi Anda adalah kunci perubahan!
                    </p>
                </div>
            </footer>

            {/* Voting Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-poppins text-2xl font-bold text-slate-900">
                                Pilih Kandidat Anda
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <Icon.X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 grid md:grid-cols-3 gap-8">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className={`relative border-2 rounded-2xl p-4 transition-all cursor-pointer group ${selectedCandidate === candidate.id ? "border-primary bg-secondary/10" : "border-slate-100 hover:border-slate-200"}`}
                                    onClick={() =>
                                        setSelectedCandidate(candidate.id)
                                    }
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={`/storage/${candidate.photo}`}
                                            alt={candidate.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-center font-poppins font-bold text-slate-900 mb-4">
                                        {candidate.name}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVote(candidate.id);
                                        }}
                                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${selectedCandidate === candidate.id ? "bg-primary text-white" : "bg-secondary text-secondary-text hover:bg-secondary-hover"}`}
                                    >
                                        Pilih Kandidat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
