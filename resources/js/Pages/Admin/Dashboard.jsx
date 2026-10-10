import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import {
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    RotateCw,
    Trophy,
    BarChart3,
    PieChart as PieChartIcon,
    Vote,
    Award,
    Download,
    Inbox,
    School,
} from "lucide-react";

const BLUE_PALETTE = [
    "#2563eb", // Royal Blue
    "#3b82f6", // Blue
    "#0284c7", // Sky Blue
    "#6366f1", // Indigo
    "#0ea5e9", // Light Sky
    "#4f46e5", // Deep Indigo
];

export default function Dashboard({
    stats = {},
    candidates = [],
    classStats = [],
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const totalVoters = stats.totalVoters || 0;
    const votedCount = stats.voted || 0;
    const notVotedCount = stats.notVoted || 0;
    const totalVotes = stats.totalVotes || 0;
    const participationRate = stats.participationRate || 0;

    // Process and sort candidates by votes
    const processedCandidates = useMemo(() => {
        const sorted = [...candidates].sort(
            (a, b) => b.vote_count - a.vote_count,
        );
        return sorted.map((cand, index) => {
            const percentage =
                totalVotes > 0
                    ? ((cand.vote_count / totalVotes) * 100).toFixed(1)
                    : 0;

            return {
                ...cand,
                rank: index + 1,
                votes: cand.vote_count,
                percentage: Number(percentage),
                color: BLUE_PALETTE[index % BLUE_PALETTE.length],
            };
        });
    }, [candidates, totalVotes]);

    const leaderCandidate =
        processedCandidates.length > 0 && totalVotes > 0
            ? processedCandidates[0]
            : null;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-800 mb-1">
                        Paslon #{data.candidate_number} — {data.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: data.color }}
                        />
                        <span className="text-slate-600 font-medium">
                            {data.votes} Suara
                        </span>
                        <span className="text-blue-600 font-bold">
                            ({data.percentage}%)
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Hasil Pemilihan - Admin E-Voting" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Pemantauan Real-Time
                            </span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-400">
                                Pemilihan Ketua & Wakil OSIS
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Hasil & Perolehan Suara
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Rekapitulasi partisipasi pemilih dan akumulasi suara
                            kandidat secara otomatis.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <a
                            href="/admin/export-results"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 shadow-2xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Hasil Excel</span>
                        </a>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-[0.98] disabled:opacity-60"
                        >
                            <RotateCw
                                className={`w-3.5 h-3.5 text-slate-500 ${
                                    isRefreshing
                                        ? "animate-spin text-blue-600"
                                        : ""
                                }`}
                            />
                            <span>
                                {isRefreshing ? "Memperbarui..." : "Refresh"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total DPT */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Total DPT
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-900 tracking-tight">
                                {totalVoters}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Pemilih Terdaftar
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Status Hak Pilih</span>
                            <span className="text-slate-700 font-bold">
                                100% Terdaftar
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Tingkat Partisipasi */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Partisipasi
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-900 tracking-tight">
                                {participationRate}%
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Suara Masuk
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(Number(participationRate), 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Sudah Memilih */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Sudah Memilih
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-emerald-600 tracking-tight">
                                {votedCount}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Suara Terverifikasi
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Status</span>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                Terhitung
                            </span>
                        </div>
                    </div>

                    {/* Card 4: Belum Memilih */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Belum Memilih
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-700 tracking-tight">
                                {notVotedCount}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Belum Hadir / Vote
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Sisa Antrean</span>
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                                Menunggu
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Bar Chart - 7 cols */}
                    <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Grafik Perolehan Suara
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Jumlah suara sah per pasangan calon
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                Histogram
                            </span>
                        </div>

                        <div className="h-72 w-full">
                            {processedCandidates.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={processedCandidates}
                                        margin={{
                                            top: 15,
                                            right: 10,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#64748b",
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}
                                            dy={8}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "#94a3b8",
                                                fontSize: 11,
                                            }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ fill: "#f8fafc" }}
                                        />
                                        <Bar
                                            dataKey="votes"
                                            radius={[8, 8, 0, 0]}
                                            barSize={38}
                                        >
                                            {processedCandidates.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
                                        <Inbox className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Belum ada data kandidat.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Donut Chart - 5 cols */}
                    <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <PieChartIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Distribusi Persentase
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Porsi persentase suara masuk
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                Donut
                            </span>
                        </div>

                        <div className="h-56 w-full relative flex items-center justify-center">
                            {totalVotes > 0 ? (
                                <>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={processedCandidates}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={84}
                                                paddingAngle={3}
                                                dataKey="votes"
                                            >
                                                {processedCandidates.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`pie-cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                content={<CustomTooltip />}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-black text-slate-900">
                                            {totalVotes}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Total Suara
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
                                        <Vote className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Belum ada suara masuk.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Legend List */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            {processedCandidates.map((cand, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs py-1 px-1 rounded-md hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: cand.color,
                                            }}
                                        />
                                        <span className="text-slate-700 font-semibold truncate text-[11px]">
                                            #{cand.candidate_number} {cand.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                                        <span className="font-bold text-slate-900">
                                            {cand.votes} suara
                                        </span>
                                        <span className="text-blue-600 font-bold">
                                            ({cand.percentage}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Class Participation Breakdown Table */}
                {classStats.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <School className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Progres Partisipasi Per Kelas / Bagian
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Rekapitulasi kehadiran pemilih tiap
                                        rombel
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 px-5">
                                            Kelas / Bagian
                                        </th>
                                        <th className="py-3 px-5 text-center">
                                            Total Pemilih
                                        </th>
                                        <th className="py-3 px-5 text-center">
                                            Sudah Memilih
                                        </th>
                                        <th className="py-3 px-5 text-center">
                                            Belum Memilih
                                        </th>
                                        <th className="py-3 px-5 w-1/4">
                                            Progres Partisipasi
                                        </th>
                                        <th className="py-3 px-5 text-right">
                                            Persentase
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {classStats.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-blue-50/20 transition-colors"
                                        >
                                            <td className="py-3 px-5 font-bold text-slate-900">
                                                {item.class_dept}
                                            </td>
                                            <td className="py-3 px-5 text-center font-semibold">
                                                {item.total}
                                            </td>
                                            <td className="py-3 px-5 text-center font-bold text-emerald-600">
                                                {item.voted}
                                            </td>
                                            <td className="py-3 px-5 text-center font-semibold text-slate-400">
                                                {item.not_voted}
                                            </td>
                                            <td className="py-3 px-5">
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-blue-600 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${Math.min(item.percentage, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-5 text-right font-black text-blue-600">
                                                {item.percentage}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
