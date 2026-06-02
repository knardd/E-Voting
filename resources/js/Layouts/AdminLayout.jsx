import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Toaster } from "sonner";
import Icon from "@/Components/Icons";

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { flash } = props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const isActive = (path) => url.startsWith(path);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-600">
            <Toaster position="top-right" richColors />
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed flex flex-col z-20">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/storage/osis2.png"
                            alt="Logo"
                            className="w-10 h-10 rounded-full"
                        />
                        <h1 className="font-poppins text-xl font-bold text-slate-900 tracking-tight">
                            Panel Admin
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 mt-8 px-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/dashboard") ? "bg-secondary text-secondary-text " : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <Icon.Dashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/create-user"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/create-user") ? "bg-secondary text-secondary-text " : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <Icon.Users className="w-5 h-5 mr-3" />
                        Kelola Pemilih
                    </Link>

                    <Link
                        href="/admin/create-candidate"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/create-candidate") ? "bg-secondary text-secondary-text" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <Icon.Candidate className="w-5 h-5 mr-3" />
                        Kelola Kandidat
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-danger-hover hover:bg-danger rounded-xl transition-all font-bold text-sm w-full"
                    >
                        <Icon.Logout className="w-5 h-5 mr-3" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
    );
}
