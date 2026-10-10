import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import {
    UserCheck,
    UserPlus,
    Pencil,
    Trash2,
    UploadCloud,
    X,
    Image as ImageIcon,
    FileText,
    Check,
    AlertCircle,
    Search,
    Eye,
    Hash,
} from "lucide-react";

export default function CreateCandidate({ candidates = [] }) {
    const [editingId, setEditingId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            candidate_number: "",
            name: "",
            visi: "",
            misi: "",
            photo: null,
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            post(`/admin/candidates/${editingId}`, {
                forceFormData: true,
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                    setEditingId(null);
                    setPreview(null);
                    reset();
                },
                onError: () => {
                    toast.error("Gagal memperbarui data kandidat.");
                },
            });
        } else {
            post("/admin/candidates", {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                    setPreview(null);
                    reset();
                },
                onError: () => {
                    toast.error("Gagal menambahkan kandidat baru.");
                },
            });
        }
    };

    const handleEdit = (candidate) => {
        setEditingId(candidate.id);
        setData({
            candidate_number: candidate.candidate_number,
            name: candidate.name,
            visi: candidate.visi,
            misi: candidate.misi,
            photo: null,
        });
        setPreview(candidate.photo ? `/storage/${candidate.photo}` : null);
        clearErrors();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kandidat "${name}"?`)) {
            router.delete(`/admin/candidates/${id}`, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                    if (editingId === id) {
                        handleCancel();
                    }
                },
                onError: () => {
                    toast.error("Gagal menghapus kandidat.");
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setPreview(null);
        reset();
        clearErrors();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData("photo", file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const filteredCandidates = useMemo(() => {
        return candidates.filter(
            (c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.visi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(c.candidate_number).includes(searchQuery)
        );
    }, [candidates, searchQuery]);

    return (
        <AdminLayout>
            <Head title="Kelola Data Paslon - Admin E-Voting" />

            <div className="space-y-6">
                {/* Header Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Manajemen Paslon</span>
                            </span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-400">
                                Calon Ketua & Wakil OSIS
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Data Pasangan Calon
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Kelola nomor urut resmi paslon, foto, serta rumusan visi dan misi pemilihan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
                            Total Paslon:{" "}
                            <span className="font-extrabold text-blue-600">
                                {candidates.length}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Main Grid: Form & List */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Form Section (5 cols) */}
                    <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    {editingId ? (
                                        <Pencil className="w-4 h-4" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        {editingId
                                            ? "Edit Data Paslon"
                                            : "Tambah Paslon Baru"}
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        {editingId
                                            ? "Perbarui nomor urut dan visi misi"
                                            : "Lengkapi data profil calon di bawah ini"}
                                    </p>
                                </div>
                            </div>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    Batal Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Candidate Number */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                    Nomor Urut Resmi Paslon
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Hash className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={data.candidate_number}
                                        onChange={(e) =>
                                            setData("candidate_number", e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400"
                                        placeholder="Contoh: 1, 2, atau 3"
                                        required
                                    />
                                </div>
                                {errors.candidate_number && (
                                    <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.candidate_number}
                                    </p>
                                )}
                            </div>

                            {/* Candidate Name */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                    Nama Lengkap Paslon
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                                    placeholder="Contoh: Ahmad Fauzi & Siti Rahma"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Visi */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                    Visi Paslon
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.visi}
                                    onChange={(e) =>
                                        setData("visi", e.target.value)
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                                    placeholder="Tuliskan visi utama kandidat..."
                                    required
                                />
                                {errors.visi && (
                                    <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.visi}
                                    </p>
                                )}
                            </div>

                            {/* Misi */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                    Misi Paslon
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.misi}
                                    onChange={(e) =>
                                        setData("misi", e.target.value)
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                                    placeholder="1. Meningkatkan kedisiplinan&#10;2. Menyelenggarakan kegiatan inovatif"
                                    required
                                />
                                {errors.misi && (
                                    <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.misi}
                                    </p>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                    Foto Resmi Paslon
                                </label>

                                {preview ? (
                                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setData("photo", null);
                                            }}
                                            className="absolute top-1.5 right-1.5 bg-slate-900/70 hover:bg-red-600 text-white p-1 rounded-md transition-colors shadow-sm"
                                            title="Hapus foto"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 rounded-2xl cursor-pointer transition-all">
                                        <div className="flex flex-col items-center justify-center p-3 text-center">
                                            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" strokeWidth={1.8} />
                                            <p className="text-[11px] text-slate-600">
                                                <span className="font-bold text-blue-600">
                                                    Pilih file foto
                                                </span>{" "}
                                                atau seret ke sini
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                PNG, JPG (Maks. 2MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                                {errors.photo && (
                                    <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            {/* Submit Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>
                                        {processing
                                            ? "Menyimpan..."
                                            : editingId
                                            ? "Perbarui Data"
                                            : "Simpan Paslon"}
                                    </span>
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Candidate List Section (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        {/* List Header & Search */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Daftar Pasangan Calon
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        {filteredCandidates.length} paslon terdaftar dalam sistem
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full sm:w-48">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari paslon..."
                                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* List Items */}
                        <div className="p-4 sm:p-5 space-y-3 max-h-[640px] overflow-y-auto">
                            {filteredCandidates.length > 0 ? (
                                filteredCandidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            {/* Photo */}
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                {candidate.photo ? (
                                                    <img
                                                        src={`/storage/${candidate.photo}`}
                                                        alt={candidate.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white">
                                                        #{candidate.candidate_number}
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                        {candidate.name}
                                                    </h4>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    <span className="font-bold text-slate-700">Visi:</span> {candidate.visi}
                                                </p>
                                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                                    <span className="font-semibold text-slate-600">Misi:</span> {candidate.misi}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCandidateDetail(
                                                        selectedCandidateDetail?.id === candidate.id
                                                            ? null
                                                            : candidate
                                                    )
                                                }
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                                title="Lihat detail visi & misi"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(candidate)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit kandidat"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        candidate.id,
                                                        candidate.name
                                                    )
                                                }
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Hapus kandidat"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-slate-400 space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-semibold">
                                        Belum ada data paslon yang terdaftar.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Expandable Detail Modal / Panel */}
                        {selectedCandidateDetail && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">
                                        Detail Visi & Misi — Paslon #{selectedCandidateDetail.candidate_number} ({selectedCandidateDetail.name})
                                    </span>
                                    <button
                                        onClick={() => setSelectedCandidateDetail(null)}
                                        className="text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1.5 text-slate-600">
                                    <p>
                                        <strong className="text-slate-800">Visi:</strong>{" "}
                                        {selectedCandidateDetail.visi}
                                    </p>
                                    <p className="whitespace-pre-line">
                                        <strong className="text-slate-800">Misi:</strong>
                                        <br />
                                        {selectedCandidateDetail.misi}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
