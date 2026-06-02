import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import Icon from "@/Components/Icons";

export default function CreateCandidate({ candidates }) {
    const [editingId, setEditingId] = useState(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            visi: "",
            misi: "",
            photo: null,
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            post(`/admin/create-candidate/${editingId}`, {
                forceFormData: true,
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                    setEditingId(null);
                    setPreview(null);
                    reset();
                },
            });
        } else {
            post("/admin/create-candidate", {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                    setPreview(null);
                    reset();
                },
            });
        }
    };

    const handleEdit = (candidate) => {
        setEditingId(candidate.id);
        setData({
            name: candidate.name,
            visi: candidate.visi,
            misi: candidate.misi,
            photo: null,
        });
        setPreview(`/storage/${candidate.photo}`);
        clearErrors();
    };

    const handleDelete = (id) => {
        if (confirm("Yakin hapus kandidat ini?")) {
            router.delete(`/admin/create-candidate/${id}`, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
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

    return (
        <AdminLayout>
            <Head title="Kelola Kandidat" />

            <div className="space-y-8">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-slate-900">
                        Kelola Kandidat
                    </h2>
                    <p className="text-slate-500">
                        Kelola daftar kandidat ketua OSIS
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-6">
                        <h3 className="font-poppins font-bold text-slate-900">
                            {editingId
                                ? "Edit Kandidat"
                                : "Tambah Kandidat Baru"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Masukkan nama kandidat"
                                />
                                {errors.name && (
                                    <p className="text-danger-hover text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Visi
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.visi}
                                    onChange={(e) =>
                                        setData("visi", e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Masukkan visi kandidat"
                                />
                                {errors.visi && (
                                    <p className="text-danger-hover text-xs mt-1">
                                        {errors.visi}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Misi
                                </label>
                                <textarea
                                    rows="5"
                                    value={data.misi}
                                    onChange={(e) =>
                                        setData("misi", e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans"
                                    placeholder="Masukkan misi (gunakan baris baru untuk setiap poin)"
                                />
                                {errors.misi && (
                                    <p className="text-danger-hover text-xs mt-1">
                                        {errors.misi}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Foto Profil
                                </label>

                                {preview && (
                                    <div className="relative w-32 h-32 mb-4">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-2xl border-2 border-primary/20 shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setData("photo", null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-danger text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Icon.X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Icon.Upload className="w-8 h-8 mb-3 text-slate-400" />
                                            <p className="mb-2 text-sm text-slate-500">
                                                <span className="font-bold">
                                                    Klik untuk upload
                                                </span>{" "}
                                                atau drag and drop
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                PNG, JPG atau WEBP (Maks. 2MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                                {errors.photo && (
                                    <p className="text-danger-hover text-xs mt-1">
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    disabled={processing}
                                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {editingId
                                        ? "Perbarui Kandidat"
                                        : "Simpan Kandidat"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-6 overflow-hidden">
                        <h3 className="font-poppins font-bold text-slate-900">
                            Daftar Kandidat
                        </h3>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {candidates.length > 0 ? (
                                candidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all group"
                                    >
                                        <img
                                            src={`/storage/${candidate.photo}`}
                                            alt={candidate.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-slate-900 truncate">
                                                {candidate.name}
                                            </h4>
                                            <p className="text-xs text-slate-400 truncate">
                                                {candidate.visi}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    handleEdit(candidate)
                                                }
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <Icon.Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(candidate.id)
                                                }
                                                className="p-2 text-danger-hover hover:bg-danger rounded-lg transition-colors"
                                            >
                                                <Icon.Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-400 text-sm py-12">
                                    Belum ada kandidat yang terdaftar.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
