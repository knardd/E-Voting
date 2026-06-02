import React from "react";
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

export default function Dashboard({ stats, candidates, chart }) {
    // Custom Tooltip component for consistent styling
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 opacity-85 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs">
                    <p className="font-bold mb-1">{payload[0].payload.name}</p>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-sm inline-block shrink-0"
                            style={{
                                backgroundColor: payload[0].payload.color_hex,
                            }}
                        />
                        <p className="text-slate-300">
                            {payload[0].value} Suara (
                            {payload[0].payload.percentage}%)
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
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Icon.Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Total Pemilih
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {stats.totalUsers}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-success-hover">
                            <Icon.CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Sudah Memilih
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {stats.voted}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-danger rounded-xl flex items-center justify-center text-danger-hover">
                            <Icon.Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Belum Memilih
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {stats.notVoted}
                            </p>
                        </div>
                    </div>
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
                                    data={candidates}
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
                                        {candidates.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color_hex}
                                            />
                                        ))}
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
                                            data={candidates}
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
                                            {candidates.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color_hex}
                                                />
                                            ))}
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
