<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoothController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VoterController;
use App\Http\Controllers\Admin\CandidateController as AdminCandidateController;

/*
|--------------------------------------------------------------------------
| Voting Booth Routes (Bilik Suara Siswa & Pemilih)
|--------------------------------------------------------------------------
*/
// Layar Standby Bilik Suara (Scan QR NIS / Input Manual Token)
Route::get('/', [BoothController::class, 'index'])->name('booth');
Route::get('/login', [BoothController::class, 'index'])->name('login'); // Fallback alias
Route::post('/booth/auth', [BoothController::class, 'authenticate'])->name('booth.auth');
Route::post('/booth/cancel', [BoothController::class, 'cancel'])->name('booth.cancel');

// Halaman Pemilihan Paslon (Khusus pemilih yang sedang aktif di bilik)
Route::middleware(['hasNotVoted', 'noCache'])->group(function () {
    Route::get('/candidate', [CandidateController::class, 'index'])->name('candidate');
    Route::post('/vote', [CandidateController::class, 'vote'])->name('vote');
});

// Halaman Sukses Voting
Route::get('/vote-success', [CandidateController::class, 'success'])
    ->middleware(['noCache'])
    ->name('vote.success');

/*
|--------------------------------------------------------------------------
| Administrator Authentication Routes
|--------------------------------------------------------------------------
*/
Route::get('/admin/login', [AuthController::class, 'showAdminLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('admin.login.post');
Route::post('/admin/logout', [AuthController::class, 'adminLogout'])->name('admin.logout')->middleware('auth');

// Shortcut redirect /admin -> /admin/dashboard
Route::get('/admin', function () {
    return redirect()->route('admin.dashboard');
});

/*
|--------------------------------------------------------------------------
| Administrator Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard & Rekapitulasi
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/export-results', [VoterController::class, 'exportResults'])->name('export.results');

    // Manajemen Pemilih (DPT)
    Route::get('/voters', [VoterController::class, 'index'])->name('voters');
    Route::get('/create-user', [VoterController::class, 'index'])->name('create.user'); // Backward compatibility
    Route::post('/voters', [VoterController::class, 'store'])->name('voters.store');
    Route::put('/voters/{voter}', [VoterController::class, 'update'])->name('voters.update');
    Route::delete('/voters/{voter}', [VoterController::class, 'destroy'])->name('voters.destroy');
    Route::post('/voters/{voter}/reset', [VoterController::class, 'resetVote'])->name('voters.reset');
    Route::post('/voters/import', [VoterController::class, 'import'])->name('voters.import');
    Route::get('/voters/export', [VoterController::class, 'export'])->name('voters.export');
    Route::get('/export-users', [VoterController::class, 'export'])->name('export.users'); // Backward compatibility

    // Manajemen Pasangan Calon (Kandidat)
    Route::get('/candidates', [AdminCandidateController::class, 'index'])->name('candidates');
    Route::get('/create-candidate', [AdminCandidateController::class, 'index'])->name('create.candidate'); // Backward compatibility
    Route::post('/candidates', [AdminCandidateController::class, 'store'])->name('candidates.store');
    Route::post('/create-candidate', [AdminCandidateController::class, 'store'])->name('create.candidate.store'); // Backward compatibility
    Route::post('/candidates/{candidate}', [AdminCandidateController::class, 'update'])->name('candidates.update');
    Route::post('/create-candidate/{candidate}', [AdminCandidateController::class, 'update'])->name('create.candidate.update'); // Backward compatibility
    Route::delete('/candidates/{candidate}', [AdminCandidateController::class, 'destroy'])->name('candidates.destroy');
    Route::delete('/create-candidate/{candidate}', [AdminCandidateController::class, 'destroy'])->name('create.candidate.destroy'); // Backward compatibility
});
