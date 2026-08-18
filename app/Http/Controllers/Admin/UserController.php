<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Exports\UsersExport;
use App\Http\Resources\UserResource;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        //Ascending (berurutan dari kecil ke besar)
        $users = UserResource::collection(
            User::orderBy('id', 'asc')->get()
        );

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
            $token = User::generateToken();
            $password = User::generatePassword();

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
}
