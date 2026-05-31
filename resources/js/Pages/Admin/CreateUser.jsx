import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateUser({ users }) {
    const { data, setData, post, processing, reset } = useForm({
        jumlah_user: 10,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/create-user', {
            onSuccess: () => reset(),
        });
    };

    const handleExport = () => {
        window.location.href = '/admin/export-users';
    };

    return (
        <AdminLayout>
            <Head title="User Management" />
            
            <div className="space-y-8">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-slate-900">User Management</h2>
                    <p className="text-slate-500">Kelola pembuatan akun pemilih secara massal</p>
                </div>

                {/* Generate Form */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-6">
                    <div className="flex items-center space-x-3 text-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <h3 className="font-poppins font-bold text-slate-900">Buat Akun Pemilih</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4 max-w-2xl">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Jumlah Akun</label>
                            <input 
                                type="number" 
                                value={data.jumlah_user}
                                onChange={e => setData('jumlah_user', e.target.value)}
                                min="1"
                                max="500"
                                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="Masukkan jumlah (Maks. 500)"
                            />
                        </div>
                        <button 
                            disabled={processing}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 h-[46px]"
                        >
                            {processing ? 'Generating...' : 'Generate User'}
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                {users.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-notion overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-poppins font-bold text-slate-900">Daftar Akun Baru</h3>
                            <button 
                                onClick={handleExport}
                                className="flex items-center space-x-2 bg-success text-success-hover font-bold py-2 px-4 rounded-lg hover:bg-success-hover hover:text-white transition-all text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span>Export Excel</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Token</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Password</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((user, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4 text-sm text-slate-500 font-medium">{index + 1}</td>
                                            <td className="px-8 py-4 text-sm font-mono font-bold text-slate-900 tracking-wider">{user.token}</td>
                                            <td className="px-8 py-4 text-sm font-mono font-bold text-slate-900 tracking-wider">{user.password}</td>
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
