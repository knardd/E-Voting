<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return User::where('role', 'siswa')
        ->select('token', 'plain_password', 'role')
        ->get()
        ->map(function ($user) {
            return [
                $user->token,
                $user->plain_password,
                $user->role,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Token',
            'Password',
            'Role'
        ];
    }
}
