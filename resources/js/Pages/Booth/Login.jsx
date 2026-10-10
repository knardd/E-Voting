import React, { useState, useEffect, useRef } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import { Html5Qrcode } from "html5-qrcode";
import {
    Camera,
    KeyRound,
    ShieldCheck,
    Lock,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    Sparkles,
    Vote,
    ArrowRight,
    CameraOff,
    RefreshCw,
    Info,
} from "lucide-react";

export default function BoothLogin() {
    const { errors, flash } = usePage().props;
    const [tokenValue, setTokenValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorType, setErrorType] = useState(null); // 'voted' | 'not_found'
    const [countdown, setCountdown] = useState(4);

    // Camera scanner states
    const [cameraState, setCameraState] = useState("loading"); // 'loading' | 'active' | 'error' | 'permission_denied'
    const [cameraError, setCameraError] = useState("");
    const html5QrCodeRef = useRef(null);
    const isScanningRef = useRef(false);
    const tokenInputRef = useRef(null);
    const timerRef = useRef(null);

    // Initialize Camera Scanner
    useEffect(() => {
        let isMounted = true;

        const startScanner = async () => {
            try {
                const qrCodeId = "qr-video-reader";
                const element = document.getElementById(qrCodeId);
                if (!element) return;

                if (html5QrCodeRef.current) {
                    try {
                        await html5QrCodeRef.current.stop();
                    } catch (e) {
                        // ignore
                    }
                }

                const qrScanner = new Html5Qrcode(qrCodeId);
                html5QrCodeRef.current = qrScanner;

                const config = {
                    fps: 10,
                    qrbox: { width: 220, height: 220 },
                    aspectRatio: 1.0,
                };

                await qrScanner.start(
                    { facingMode: "user" }, // Use front/webcam camera
                    config,
                    (decodedText) => {
                        if (isScanningRef.current && !isSubmitting) {
                            handleQrScanned(decodedText);
                        }
                    },
                    (errorMessage) => {
                        // Ignore continuous scan misses
                    },
                );

                if (isMounted) {
                    isScanningRef.current = true;
                    setCameraState("active");
                }
            } catch (err) {
                console.error("Camera Scanner Error:", err);
                if (isMounted) {
                    setCameraState("error");
                    setCameraError(
                        err?.name === "NotAllowedError"
                            ? "Izin akses kamera ditolak. Silakan izinkan kamera di browser."
                            : "Kamera tidak ditemukan atau sedang digunakan oleh aplikasi lain.",
                    );
                }
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            isScanningRef.current = false;
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current
                    .stop()
                    .then(() => {
                        html5QrCodeRef.current?.clear();
                    })
                    .catch(() => {
                        // ignore cleanup error
                    });
            }
        };
    }, []);

    // Handle incoming errors from backend with 2-second auto-reset
    useEffect(() => {
        if (errors?.voted_error) {
            setErrorMessage(errors.voted_error);
            setErrorType("voted");
            startAutoReset();
        } else if (errors?.auth_error) {
            setErrorMessage(errors.auth_error);
            setErrorType("not_found");
            startAutoReset();
        } else if (flash?.error) {
            setErrorMessage(flash.error);
            setErrorType("not_found");
            startAutoReset();
        }
    }, [errors, flash]);

    const startAutoReset = () => {
        isScanningRef.current = false; // Pause camera triggers while displaying error
        setCountdown(4);
        if (timerRef.current) clearInterval(timerRef.current);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    clearErrorAndReset();
                    return 4;
                }
                return prev - 1;
            });
        }, 1000);

        timerRef.current = interval;
    };

    const clearErrorAndReset = () => {
        setErrorMessage(null);
        setErrorType(null);
        setTokenValue("");
        isScanningRef.current = true; // Resume camera scanning
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleQrScanned = (nisText) => {
        if (!nisText || isSubmitting) return;
        isScanningRef.current = false; // Prevent multiple fires
        submitAuth("scan", nisText.trim());
    };

    const handleTokenSubmit = (e) => {
        e.preventDefault();
        if (!tokenValue.trim() || isSubmitting) return;
        submitAuth("token", tokenValue.trim().toUpperCase());
    };

    const submitAuth = (type, value) => {
        setIsSubmitting(true);
        router.post(
            "/booth/auth",
            { type, value },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleRetryCamera = () => {
        setCameraState("loading");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
            <Head title="Bilik Suara Digital - Pemilihan OSIS" />

            {/* Top Navigation Bar */}
            <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                            <Vote className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block leading-none">
                                Bilik Suara Mandiri
                            </span>
                            <h1 className="text-sm font-bold text-slate-900 leading-tight">
                                E-Voting Pemilihan OSIS
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live Ready Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Bilik Suara Siap</span>
                        </div>

                        {/* Admin Link */}
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all"
                            title="Akses Administrator / Panitia"
                        >
                            <Lock className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                                Panel Admin
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Interactive Booth Area */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-5xl space-y-6">
                    {/* Header Title */}
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Masa Bakti 2026 / 2027</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Selamat Datang di Bilik Suara
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Arahkan QR kartu absen siswa Anda ke kamera sebelah
                            kiri, atau masukkan token di sebelah kanan.
                        </p>
                    </div>

                    {/* Auto-Reset Alert Banner when error happens */}
                    {errorMessage && (
                        <div
                            className={`p-4 rounded-3xl border transition-all animate-in fade-in zoom-in-95 duration-200 max-w-2xl mx-auto shadow-sm ${
                                errorType === "voted"
                                    ? "bg-amber-50 border-amber-200 text-amber-900"
                                    : "bg-red-50 border-red-200 text-red-900"
                            }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="mt-0.5 shrink-0">
                                    {errorType === "voted" ? (
                                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                        {errorType === "voted"
                                            ? "Hak Pilih Sudah Digunakan"
                                            : "Verifikasi Gagal"}
                                    </h4>
                                    <p className="text-xs sm:text-sm mt-0.5 leading-relaxed font-semibold">
                                        {errorMessage}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold opacity-80 border-t border-current/10 pt-2">
                                        <span>
                                            Kamera akan aktif kembali
                                            otomatis...
                                        </span>
                                        <span className="font-mono bg-white px-2 py-0.5 rounded-md shadow-2xs">
                                            {countdown}s
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2-BAR SIDE-BY-SIDE: LEFT (CAMERA SCANNER) & RIGHT (TOKEN INPUT) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* BAR KIRI: KAMERA LIVE QR SCANNER */}
                        <div className="bg-white rounded-3xl border-2 border-blue-500/80 shadow-md p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
                            {/* Top Badge */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Scan Kamera (Kartu Absen)</span>
                                </span>
                                {cameraState === "active" && (
                                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Kamera Siap
                                    </span>
                                )}
                            </div>

                            {/* Live Video Scanner Container */}
                            <div className="my-auto py-2 space-y-4 text-center">
                                <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-blue-500 shadow-inner flex items-center justify-center">
                                    {/* HTML5 QR Video Element Mount Target */}
                                    <div
                                        id="qr-video-reader"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Loading State */}
                                    {cameraState === "loading" && (
                                        <div className="absolute inset-0 bg-slate-900 text-white flex flex-col items-center justify-center p-4 gap-2">
                                            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                                            <span className="text-xs font-semibold">
                                                Mengaktifkan Kamera...
                                            </span>
                                        </div>
                                    )}

                                    {/* Camera Error State */}
                                    {cameraState === "error" && (
                                        <div className="absolute inset-0 bg-slate-900 text-white flex flex-col items-center justify-center p-5 text-center gap-2">
                                            <CameraOff className="w-10 h-10 text-red-400 mb-1" />
                                            <span className="text-xs font-bold text-red-300">
                                                Gagal Memuat Kamera
                                            </span>
                                            <p className="text-[10px] text-slate-400 leading-tight">
                                                {cameraError}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleRetryCamera}
                                                className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                                            >
                                                Coba Lagi
                                            </button>
                                        </div>
                                    )}

                                    {/* Submitting Overlay */}
                                    {isSubmitting && (
                                        <div className="absolute inset-0 bg-blue-600/80 backdrop-blur-xs text-white flex flex-col items-center justify-center p-4 gap-2 z-10 animate-in fade-in duration-150">
                                            <RefreshCw className="w-8 h-8 animate-spin" />
                                            <span className="text-xs font-bold">
                                                Memverifikasi NIS...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Posisikan QR Kartu di Depan Kamera
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        Kamera akan mendeteksi QR code kartu
                                        siswa secara otomatis dan membuka bilik
                                        suara.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 text-center">
                                <span className="text-[11px] text-blue-600 font-semibold">
                                    Metode Otomatis & Tercepat
                                </span>
                            </div>
                        </div>

                        {/* BAR KANAN: INPUT TOKEN MANUAL */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
                            {/* Top Badge */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Input Token Manual</span>
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    Jalur Cadangan
                                </span>
                            </div>

                            <form
                                onSubmit={handleTokenSubmit}
                                className="space-y-6 my-auto py-4"
                            >
                                <div className="text-center space-y-1">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                                        <KeyRound className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Masukkan 6 Digit Token
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        Gunakan token unik jika kartu absen
                                        tertinggal atau kamera tidak dapat
                                        membaca QR.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        ref={tokenInputRef}
                                        type="text"
                                        maxLength={10}
                                        value={tokenValue}
                                        onChange={(e) =>
                                            setTokenValue(
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="CONTOH: 9H7K2A"
                                        disabled={
                                            isSubmitting || !!errorMessage
                                        }
                                        className="w-full py-3.5 px-4 text-center rounded-2xl border-2 border-slate-200 text-lg font-mono font-bold tracking-widest uppercase text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-400 text-center">
                                        Token tertera pada daftar pemilih /
                                        panitia bilik
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        !tokenValue.trim() ||
                                        isSubmitting ||
                                        !!errorMessage
                                    }
                                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <span>
                                        {isSubmitting
                                            ? "Memverifikasi..."
                                            : "Buka Bilik Suara"}
                                    </span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="pt-3 border-t border-slate-100 text-center">
                                <span className="text-[11px] text-slate-400">
                                    Bantuan hubungi panitia pengawas bilik
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Minimal Footer */}
            <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
                    <p>© 2026 Panitia Pemilihan Ketua & Wakil OSIS</p>
                    <p className="text-[11px] text-slate-400">
                        Sistem E-Voting Berbasis Laravel & Inertia
                    </p>
                </div>
            </footer>
        </div>
    );
}
