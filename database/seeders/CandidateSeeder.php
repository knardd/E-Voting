<?php

namespace Database\Seeders;

use App\Models\Candidate;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = [
            [
                'candidate_number' => 1,
                'name' => 'Aditya Pratama & Nabila Putri',
                'visi' => 'Mewujudkan OSIS yang kreatif, inklusif, dan berintegritas tinggi dalam mendukung prestasi siswa.',
                'misi' => "1. Menyelenggarakan kegiatan ekstrakurikuler berbasis teknologi dan seni.\n2. Membangun ruang aspirasi siswa yang terbuka dan transparan.\n3. Menggalakkan kepedulian lingkungan dan sosial di lingkungan sekolah.",
                'photo' => null,
                'vote_count' => 0,
            ],
            [
                'candidate_number' => 2,
                'name' => 'Bima Arya & Chelsea Olivia',
                'visi' => 'Membangun karakter siswa yang berdaya saing global dengan berlandaskan budi pekerti luhur.',
                'misi' => "1. Meningkatkan kedisiplinan dan budaya literasi sekolah.\n2. Mengadakan festival bakat dan kompetisi akademik antarkelas.\n3. Mempererat kolaborasi antara siswa, guru, dan komunitas sekolah.",
                'photo' => null,
                'vote_count' => 0,
            ],
            [
                'candidate_number' => 3,
                'name' => 'Dimas Anggara & Farah Quinn',
                'visi' => 'Menjadikan OSIS sebagai wadah kolaborasi inovatif yang aktif, adaptif, dan berwawasan masa depan.',
                'misi' => "1. Mengoptimalkan platform digital untuk publikasi dan informasi kegiatan siswa.\n2. Mendukung program kewirausahaan siswa (student enterprise).\n3. Menciptakan lingkungan sekolah yang aman, nyaman, dan bebas perundungan.",
                'photo' => null,
                'vote_count' => 0,
            ],
        ];

        foreach ($candidates as $cand) {
            Candidate::updateOrCreate(
                ['candidate_number' => $cand['candidate_number']],
                $cand
            );
        }
    }
}
