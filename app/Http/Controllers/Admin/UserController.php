<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'asc')->get()->map(function ($user) {
            return [
                'token' => $user->token,
                'password' => $user->plain_password ?? '******',
            ];
        });

        return Inertia::render('Admin/CreateUser', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jumlah_user' => 'required|integer|min:1|max:500',
        ]);

        for ($i = 0; $i < $request->jumlah_user; $i++) {
            $token = $this->generateToken();
            $password = $this->generatePassword();

            User::create([
                'token' => $token,
                'password' => Hash::make($password),
                'plain_password' => $password,
            ]);
        }

        return redirect()->back()->with('success', 'User berhasil ditambahkan!');
    }

    public function export()
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    private function generateToken($length = 6)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $token = '';

        for ($i = 0; $i < $length; $i++) {
            $token .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $token;
    }

    private function generatePassword()
    {
        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
