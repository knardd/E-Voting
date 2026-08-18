import React, { useMemo } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Icon from "@/Components/Icons";
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
    Legend,
} from "recharts";

const COLOR_PALETTE = [
    "#E16A6A", // Kandidat 1
    "#FFB84D", // Kandidat 2
    "#3B82F6", // Kandidat 3
    "#22C55E", // Kandidat 4
    "#f59e0b", // Kandidat 5
];

const StatsCard = ({ icon: IconComponent, label, value, bgColor, textColor }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center ${textColor}`}>
            <IconComponent className="w-6 h-6" />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {label}
            </p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

export default function Dashboard({ stats, candidates }) {
    // Process candidate data for visual presentation
    const processedCandidates = useMemo(() => {
        return candidates.map((candidate, index) => {
            const percentage =
                stats.totalVotes > 0
                    ? ((candidate.votes / stats.totalVotes) * 100).toFixed(1)
                    : 0;

            return {
                ...candidate,
                percentage,
                color: COLOR_PALETTE[index % COLOR_PALETTE.length],
            };
        });
    }, [candidates, stats.totalVotes]);

    // Custom Tooltip component for consistent styling
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 opacity-85 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs">
                    <p className="font-bold mb-1">{data.name}</p>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-sm inline-block shrink-0"
                            style={{
                                backgroundColor: data.color,
                            }}
                        />
                        <p className="text-slate-300">
                            {data.votes} Suara ({data.percentage}%)
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-8">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-slate-900">
                        Hasil Pemilihan
                    </h2>
                    <p className="text-slate-500">
                        Pantau perolehan suara secara real-time
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        icon={Icon.Users}
                        label="Total Pemilih"
                        value={stats.totalUsers}
                        bgColor="bg-primary/10"
                        textColor="text-primary"
                    />
                    <StatsCard
                        icon={Icon.CheckCircle}
                        label="Sudah Memilih"
                        value={stats.voted}
                        bgColor="bg-success"
                        textColor="text-success-hover"
                    />
                    <StatsCard
                        icon={Icon.Clock}
                        label="Belum Memilih"
                        value={stats.notVoted}
                        bgColor="bg-danger"
                        textColor="text-danger-hover"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart Section */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-8">
                        <h3 className="font-poppins font-bold text-slate-900">
                            Perolehan Suara
                        </h3>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={processedCandidates}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
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
                                            fill: "#94a3b8",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#94a3b8",
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#f8fafc" }}
                                    />
                                    <Bar
                                        dataKey="votes"
                                        radius={[6, 6, 0, 0]}
                                        barSize={40}
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
                        </div>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-8">
                        <h3 className="font-poppins font-bold text-slate-900">
                            Persentase Suara
                        </h3>

                        <div className="h-72 w-full">
                            {stats.totalVotes > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={processedCandidates}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="votes"
                                            label={({ percentage }) =>
                                                `${percentage}%`
                                            }
                                            labelLine={false}
                                        >
                                            {processedCandidates.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            wrapperStyle={{
                                                paddingTop: "20px",
                                                paddingLeft: "10px",
                                            }}
                                            formatter={(value, entry) => (
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider ml-2">
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                        <Icon.ChartPie className="w-10 h-10" />
                                    </div>
                                    <p className="text-slate-450 text-sm italic">
                                        Belum ada suara masuk...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
