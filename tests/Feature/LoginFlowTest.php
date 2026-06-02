<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('halaman login dapat diakses', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('siswa dapat login dengan token dan password yang benar', function () {
    // 1. Siapkan data siswa
    $user = User::factory()->create([
        'token' => '12345',
        'password' => Hash::make('password123'),
        'role' => 'siswa'
    ]);

    // 2. Lakukan aksi login
    $response = $this->post('/login', [
        'token' => '12345',
        'password' => 'password123',
    ]);

    // 3. Pastikan diarahkan ke halaman daftar kandidat
    $response->assertRedirect('/candidate');
    $this->assertAuthenticatedAs($user);
});

test('admin dapat login dan masuk ke dashboard admin', function () {
    $admin = User::factory()->create([
        'token' => 'admin_oke',
        'password' => Hash::make('secret'),
        'role' => 'admin'
    ]);

    $response = $this->post('/login', [
        'token' => 'admin_oke',
        'password' => 'secret',
    ]);

    $response->assertRedirect('/admin/dashboard');
    $this->assertAuthenticatedAs($admin);
});

test('siswa tidak boleh mengakses dashboard admin', function () {
    $siswa = User::factory()->create(['role' => 'siswa']);

    $response = $this->actingAs($siswa)->get('/admin/dashboard');

    // Pastikan dilarang (403 atau redirect tergantung middleware IsAdmin Anda)
    $response->assertRedirect('/'); 
});
