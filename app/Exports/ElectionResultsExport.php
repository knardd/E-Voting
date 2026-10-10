<?php

namespace App\Exports;

use App\Models\Candidate;
use App\Models\Voter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ElectionResultsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $totalVotes;

    public function __construct()
    {
        $this->totalVotes = Candidate::sum('vote_count');
    }

    public function collection()
    {
        return Candidate::orderBy('candidate_number', 'asc')->get();
    }

    public function headings(): array
    {
        return [
            'Nomor Urut',
            'Nama Pasangan Calon',
            'Total Suara Masuk',
            'Persentase Suara (%)',
        ];
    }

    public function map($candidate): array
    {
        $percentage = $this->totalVotes > 0 ? round(($candidate->vote_count / $this->totalVotes) * 100, 2) : 0;

        return [
            "Paslon #{$candidate->candidate_number}",
            $candidate->name,
            $candidate->vote_count,
            "{$percentage} %",
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF1E293B'],
                ],
            ],
        ];
    }
}
