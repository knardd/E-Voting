<?php

namespace Database\Seeders;

use App\Models\Voter;
use Illuminate\Database\Seeder;

class VoterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $voters = [
            [
                'nis' => '1001',
                'name' => 'Ahmad Rizky',
                'role' => 'siswa',
                'class_dept' => 'XII MIPA 1',
            ],
            [
                'nis' => '1002',
                'name' => 'Siti Aisyah',
                'role' => 'siswa',
                'class_dept' => 'XII MIPA 2',
            ],
            [
                'nis' => '1003',
                'name' => 'Muhammad Fajar',
                'role' => 'siswa',
                'class_dept' => 'XI IPS 1',
            ],
            [
                'nis' => '1004',
                'name' => 'Dewi Lestari',
                'role' => 'siswa',
                'class_dept' => 'X-A',
            ],
            [
                'nis' => '1005',
                'name' => 'Budi Santoso, S.Pd.',
                'role' => 'guru',
                'class_dept' => 'Dewan Guru',
            ],
        ];

        foreach ($voters as $voter) {
            Voter::updateOrCreate(
                ['nis' => $voter['nis']],
                [
                    'token' => Voter::generateUniqueToken(),
                    'name' => $voter['name'],
                    'role' => $voter['role'],
                    'class_dept' => $voter['class_dept'],
                    'status_voted' => false,
                    'voted_at' => null,
                ]
            );
        }
    }
}
