import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { url } = usePage();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const isActive = (path) => url.startsWith(path);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-600">
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
                            Admin Panel
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 mt-8 px-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/dashboard") ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/create-user"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/create-user") ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            ></path>
                        </svg>
                        User Management
                    </Link>

                    <Link
                        href="/admin/create-candidate"
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive("/admin/create-candidate") ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            ></path>
                        </svg>
                        Candidate Management
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-danger-hover hover:bg-danger rounded-xl transition-all font-bold text-sm"
                    >
                        <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
    );
}
