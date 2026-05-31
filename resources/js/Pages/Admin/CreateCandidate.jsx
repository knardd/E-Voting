import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateCandidate({ candidates }) {
    const [editingId, setEditingId] = useState(null);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        visi: '',
        misi: '',
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            post(`/admin/create-candidate/${editingId}`, {
                forceFormData: true,
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post('/admin/create-candidate', {
                onSuccess: () => reset(),
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
        clearErrors();
    };

    const handleDelete = (id) => {
        if (confirm('Yakin hapus kandidat ini?')) {
            router.delete(`/admin/create-candidate/${id}`);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    return (
        <AdminLayout>
            <Head title="Candidate Management" />
            
            <div className="space-y-8">
                <div>
                    <h2 className="font-poppins text-2xl font-bold text-slate-900">Candidate Management</h2>
                    <p className="text-slate-500">Kelola daftar kandidat ketua OSIS</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-notion space-y-6">
                        <h3 className="font-poppins font-bold text-slate-900">
                            {editingId ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Masukkan nama kandidat"
                                />
                                {errors.name && <p className="text-danger-hover text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Visi</label>
                                <textarea 
                                    rows="3"
                                    value={data.visi}
                                    onChange={e => setData('visi', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Masukkan visi kandidat"
                                />
                                {errors.visi && <p className="text-danger-hover text-xs mt-1">{errors.visi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Misi</label>
                                <textarea 
                                    rows="5"
                                    value={data.misi}
                                    onChange={e => setData('misi', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans"
                                    placeholder="Masukkan misi (gunakan baris baru untuk setiap poin)"
                                />
                                {errors.misi && <p className="text-danger-hover text-xs mt-1">{errors.misi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Foto Profil</label>
                                <input 
                                    type="file" 
                                    onChange={e => setData('photo', e.target.files[0])}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    accept="image/*"
                                />
                                {errors.photo && <p className="text-danger-hover text-xs mt-1">{errors.photo}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    disabled={processing}
                                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {editingId ? 'Update Kandidat' : 'Simpan Kandidat'}
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
                        <h3 className="font-poppins font-bold text-slate-900">Daftar Kandidat</h3>
                        
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {candidates.length > 0 ? candidates.map((candidate) => (
                                <div key={candidate.id} className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all group">
                                    <img 
                                        src={`/storage/${candidate.photo}`} 
                                        alt={candidate.name} 
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-slate-900 truncate">{candidate.name}</h4>
                                        <p className="text-xs text-slate-400 truncate">{candidate.visi}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(candidate)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(candidate.id)}
                                            className="p-2 text-danger-hover hover:bg-danger rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-slate-400 text-sm py-12">Belum ada kandidat yang terdaftar.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
