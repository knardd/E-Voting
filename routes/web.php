<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CandidateController as AdminCandidateController;
use Inertia\Inertia;

// Authentication Routes
Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Student / Voter Routes
Route::middleware(['auth', 'hasNotVoted', 'noCache'])->group(function () {
    Route::get('/candidate', [CandidateController::class, 'index'])->name('candidate');
    Route::post('/vote', [CandidateController::class, 'vote'])->name('vote');
});

Route::get('/vote-success', [CandidateController::class, 'success'])
    ->middleware(['auth', 'noCache'])
    ->name('vote.success');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User Management
    Route::get('/create-user', [UserController::class, 'index'])->name('create.user');
    Route::post('/create-user', [UserController::class, 'store'])->name('create.user.store');
    Route::get('/export-users', [UserController::class, 'export'])->name('export.users');

    // Candidate Management
    Route::get('/create-candidate', [AdminCandidateController::class, 'index'])->name('create.candidate');
    Route::post('/create-candidate', [AdminCandidateController::class, 'store'])->name('create.candidate.store');
    Route::post('/create-candidate/{candidate}', [AdminCandidateController::class, 'update'])->name('create.candidate.update');
    Route::delete('/create-candidate/{candidate}', [AdminCandidateController::class, 'destroy'])->name('create.candidate.destroy');
});
