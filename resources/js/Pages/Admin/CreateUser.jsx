import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import {
    Users,
    UserPlus,
    Download,
    UploadCloud,
    Search,
    Copy,
    Check,
    CheckCircle2,
    Clock,
    KeyRound,
    RotateCcw,
    Trash2,
    Filter,
    X,
    FileSpreadsheet,
    CreditCard,
    AlertCircle,
} from "lucide-react";

export default function CreateUser({ voters, classes = [], filters = {} }) {
    const voterList = voters?.data || [];
    const [search, setSearch] = useState(filters.search || "");
    const [selectedClass, setSelectedClass] = useState(filters.class_dept || "");
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");
    const [copiedToken, setCopiedToken] = useState(null);

    // Modal states
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Import Form
    const {
        data: importData,
        setData: setImportData,
        post: postImport,
        processing: isImporting,
        reset: resetImport,
        errors: importErrors,
    } = useForm({
        file: null,
    });

    // Add Single Voter Form
    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: isAdding,
        reset: resetAdd,
        errors: addErrors,
    } = useForm({
        name: "",
        nis: "",
        class_dept: "",
        role: "siswa",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/admin/voters",
            {
                search: search || undefined,
                class_dept: selectedClass || undefined,
                status: selectedStatus || undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterChange = (key, value) => {
        let newSearch = search;
        let newClass = selectedClass;
        let newStatus = selectedStatus;

        if (key === "class_dept") {
            newClass = value;
            setSelectedClass(value);
        } else if (key === "status") {
            newStatus = value;
            setSelectedStatus(value);
        }

        router.get(
            "/admin/voters",
            {
                search: newSearch || undefined,
                class_dept: newClass || undefined,
                status: newStatus || undefined,
            },
            { preserveState: true }
        );
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedClass("");
        setSelectedStatus("");
        router.get("/admin/voters");
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!importData.file) return;

        postImport("/admin/voters/import", {
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                }
                setIsImportModalOpen(false);
                resetImport();
            },
            onError: (errs) => {
                toast.error(errs.file || "Gagal mengimpor file Excel.");
            },
        });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        postAdd("/admin/voters", {
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success);
                }
                setIsAddModalOpen(false);
                resetAdd();
            },
            onError: () => {
                toast.error("Gagal menambahkan data pemilih.");
            },
        });
    };

    const handleResetVote = (voter) => {
        if (
            confirm(
                `Apakah Anda yakin ingin mereset status hak pilih "${voter.name}" agar dapat memilih ulang?`
            )
        ) {
            router.post(
                `/admin/voters/${voter.id}/reset`,
                {},
                {
                    onSuccess: (page) => {
                        if (page.props.flash?.success) {
                            toast.success(page.props.flash.success);
                        }
                    },
                }
            );
        }
    };

    const handleDeleteVoter = (voter) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data pemilih "${voter.name}"?`)) {
            router.delete(`/admin/voters/${voter.id}`, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        toast.success(page.props.flash.success);
                    }
                },
            });
        }
    };

    const handleExport = () => {
        const query = selectedClass ? `?class_dept=${encodeURIComponent(selectedClass)}` : "";
        window.location.href = `/admin/voters/export${query}`;
    };

    const handleCopyToken = (token, id) => {
        navigator.clipboard.writeText(token);
        setCopiedToken(id);
        toast.success(`Token ${token} disalin ke clipboard`);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <AdminLayout>
            <Head title="Kelola Data Pemilih (DPT) - Admin E-Voting" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                                <Users className="w-3.5 h-3.5" />
                                <span>Daftar Pemilih Tetap (DPT)</span>
                            </span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-400">
                                Siswa & Dewan Guru
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Manajemen Data Pemilih
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Kelola data NIS, token pemilih, import Excel massal, dan rekap presensi voting.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 shadow-2xs"
                        >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Import Excel</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-2xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export DPT</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Tambah Pemilih</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan NIS, Nama Siswa, atau Token..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            />
                        </div>

                        {/* Filter by Class */}
                        <div className="w-full md:w-48">
                            <select
                                value={selectedClass}
                                onChange={(e) =>
                                    handleFilterChange("class_dept", e.target.value)
                                }
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-white font-medium"
                            >
                                <option value="">Semua Kelas / Bagian</option>
                                {classes.map((cls, idx) => (
                                    <option key={idx} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter by Status */}
                        <div className="w-full md:w-44">
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600 bg-white font-medium"
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Sudah Memilih</option>
                                <option value="0">Belum Memilih</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                            Cari
                        </button>

                        {(search || selectedClass || selectedStatus) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
                                title="Reset Filter"
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* Voters Table Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <KeyRound className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Daftar Pemilih
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    Total {voters.total || voterList.length} pemilih terdaftar
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-5 w-14">No</th>
                                    <th className="py-3 px-5">NIS (Kartu Absen)</th>
                                    <th className="py-3 px-5">Token Manual</th>
                                    <th className="py-3 px-5">Nama Pemilih</th>
                                    <th className="py-3 px-5">Kelas / Bagian</th>
                                    <th className="py-3 px-5">Status Voting</th>
                                    <th className="py-3 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {voterList.map((voter, index) => (
                                    <tr
                                        key={voter.id}
                                        className="hover:bg-blue-50/20 transition-colors"
                                    >
                                        <td className="py-3 px-5 font-semibold text-slate-400">
                                            {(voters.current_page - 1) * voters.per_page + index + 1}
                                        </td>
                                        <td className="py-3 px-5 font-mono font-bold text-slate-800">
                                            {voter.nis ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                                                    <CreditCard className="w-3 h-3 text-slate-500" />
                                                    {voter.nis}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-5 font-mono font-extrabold text-blue-600 tracking-wider">
                                            {voter.token}
                                        </td>
                                        <td className="py-3 px-5 font-bold text-slate-900">
                                            {voter.name}
                                        </td>
                                        <td className="py-3 px-5 font-medium text-slate-600">
                                            {voter.class_dept || "-"}
                                        </td>
                                        <td className="py-3 px-5">
                                            {voter.status_voted ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    Sudah Memilih
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    Belum Memilih
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyToken(voter.token, voter.id)
                                                    }
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Salin Token"
                                                >
                                                    {copiedToken === voter.id ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>

                                                {voter.status_voted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResetVote(voter)}
                                                        className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                                        title="Reset Status Voting (Darurat)"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteVoter(voter)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Hapus Pemilih"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {voterList.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-slate-400 text-xs"
                                        >
                                            Tidak ada data pemilih yang sesuai kriteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {voters.links && voters.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                Halaman {voters.current_page} dari {voters.last_page}
                            </span>
                            <div className="flex gap-1">
                                {voters.links.map((link, lIdx) => (
                                    <button
                                        key={lIdx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                ? "bg-slate-50 hover:bg-slate-100 text-slate-700"
                                                : "text-slate-300 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: BULK IMPORT EXCEL */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => !isImporting && setIsImportModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-5 z-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FileSpreadsheet className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Import Data Siswa (Excel/CSV)
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsImportModalOpen(false)}
                                disabled={isImporting}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all p-4 text-center">
                                    <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {importData.file
                                            ? importData.file.name
                                            : "Pilih file Excel (.xlsx / .csv)"}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">
                                        Format kolom: nis, nama, kelas
                                    </span>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        className="hidden"
                                        onChange={(e) =>
                                            setImportData("file", e.target.files[0])
                                        }
                                        required
                                    />
                                </label>
                                {importErrors.file && (
                                    <p className="text-red-500 text-xs font-semibold">
                                        {importErrors.file}
                                    </p>
                                )}
                            </div>

                            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
                                <p className="font-bold text-blue-800">Petunjuk Format Excel:</p>
                                <p>Pastikan baris pertama (header) memiliki kolom: <strong>nis</strong>, <strong>nama</strong>, dan <strong>kelas</strong>. Token akan digenerate otomatis oleh sistem.</p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    disabled={isImporting}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!importData.file || isImporting}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50"
                                >
                                    {isImporting ? "Mengimpor..." : "Proses Import"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD SINGLE VOTER */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                        onClick={() => !isAdding && setIsAddModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 space-y-5 z-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Tambah Pemilih Baru
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                disabled={isAdding}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase">
                                    Nama Lengkap Siswa / Guru
                                </label>
                                <input
                                    type="text"
                                    value={addData.name}
                                    onChange={(e) => setAddData("name", e.target.value)}
                                    placeholder="Contoh: Muhammad Farhan"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                                    required
                                />
                                {addErrors.name && (
                                    <p className="text-red-500 text-xs">{addErrors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase">
                                    NIS (Nomor Induk Siswa)
                                </label>
                                <input
                                    type="text"
                                    value={addData.nis}
                                    onChange={(e) => setAddData("nis", e.target.value)}
                                    placeholder="Contoh: 1024 (Sesuai QR Kartu Absen)"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                                {addErrors.nis && (
                                    <p className="text-red-500 text-xs">{addErrors.nis}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase">
                                    Kelas / Bagian
                                </label>
                                <input
                                    type="text"
                                    value={addData.class_dept}
                                    onChange={(e) => setAddData("class_dept", e.target.value)}
                                    placeholder="Contoh: XII MIPA 1 atau Dewan Guru"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={isAdding}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50"
                                >
                                    {isAdding ? "Menyimpan..." : "Simpan Pemilih"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
