import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Icon from "@/Components/Icons";

export default function Login({ login_error }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        token: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onError: (errors) => {
                toast.error(errors.login_error || "Token atau password salah.");
            },
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-600 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Login" />

            <Toaster position="top-center" richColors theme="light" />

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
                    Selamat Datang
                </h1>
                <p className="text-center text-slate-500 text-sm mb-8">
                    Login untuk memilih kandidat terbaik
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-slate-100 rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        <Icon.Eye className="w-5 h-5" />
                                    ) : (
                                        <Icon.EyeOff className="w-5 h-5" />
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
                                {processing ? "Memproses..." : "Masuk"}
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
