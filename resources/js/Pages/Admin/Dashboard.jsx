import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats, candidates, chart }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-slate-900">Hasil Pemilihan</h2>
                    <p className="text-slate-500">Pantau perolehan suara secara real-time</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total User</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-success-hover">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sudah Memilih</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.voted}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-notion flex items-center space-x-4">
                        <div className="w-12 h-12 bg-danger rounded-xl flex items-center justify-center text-danger-hover">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum Memilih</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.notVoted}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-8">
                        <h3 className="font-poppins font-bold text-slate-900">Perolehan Suara</h3>
                        
                        <div className="flex gap-4 h-64">
                            <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 text-right w-8">
                                {chart.steps.map((step, i) => <span key={i}>{step}</span>)}
                                <span>0</span>
                            </div>
                            <div className="flex-1 flex items-end justify-around border-b border-slate-100 pb-2 gap-2 relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                                    {chart.steps.map((_, i) => <div key={i} className="w-full border-t border-slate-50 border-dashed"></div>)}
                                </div>
                                
                                {candidates.map((candidate, i) => (
                                    <div key={i} className="relative group flex-1 max-w-[40px] flex flex-col items-center justify-end h-full z-10">
                                        <div 
                                            className={`${candidate.color_class} w-full rounded-t-lg transition-all duration-700 hover:opacity-80`}
                                            style={{ height: `${candidate.height}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {candidate.votes} Suara
                                            </div>
                                        </div>
                                        <p className="absolute top-full mt-2 text-[10px] font-bold text-slate-400 text-center leading-tight truncate w-full">
                                            {candidate.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-8">
                        <h3 className="font-poppins font-bold text-slate-900">Persentase Suara</h3>
                        <div className="flex flex-col items-center justify-center space-y-8">
                            {stats.totalVotes > 0 ? (
                                <>
                                    <div 
                                        className="w-48 h-48 rounded-full shadow-inner shadow-black/5"
                                        style={{ background: `conic-gradient(${chart.pieGradient})` }}
                                    ></div>
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {candidates.map((candidate, i) => (
                                            <div key={i} className="flex items-center space-x-3 p-2 rounded-xl border border-slate-50">
                                                <div className={`w-3 h-3 rounded-full ${candidate.color_class}`}></div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{candidate.name}</p>
                                                    <p className="text-[10px] text-slate-400">{candidate.percentage}% ({candidate.votes})</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                    </div>
                                    <p className="text-slate-400 text-sm">Menunggu suara masuk...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
