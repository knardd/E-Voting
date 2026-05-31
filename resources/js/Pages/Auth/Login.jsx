import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function Login({ login_error }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        token: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-600 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Login" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo Section */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/storage/osis2.png"
                        alt="Logo OSIS"
                        className="w-20 h-20 rounded-full border border-slate-100 p-1 shadow-sm"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                </div>

                <h1 className="font-poppins text-3xl font-bold text-center text-slate-900 mb-2">
                    Welcome
                </h1>
                <p className="text-center text-slate-500 text-sm mb-8">
                    Login untuk memilih kandidat terbaik
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-slate-100 rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Alert */}
                        {(login_error || Object.keys(errors).length > 0) && (
                            <div className="bg-danger px-4 py-3 rounded-lg border border-danger-hover/10 flex items-start space-x-3">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-danger-hover shrink-0"></div>
                                <span className="text-danger-hover font-medium text-sm">
                                    {login_error ||
                                        errors.token ||
                                        errors.password ||
                                        "Token atau password salah."}
                                </span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="token"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Token
                            </label>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                value={data.token}
                                onChange={(e) =>
                                    setData("token", e.target.value)
                                }
                                placeholder="Masukkan Token Anda"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password Anda"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-70"
                            >
                                {processing ? "Loading..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-slate-400 text-xs mt-8">
                        © 2025 Created by{" "}
                        <span className="text-primary font-semibold">
                            Kennard
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
