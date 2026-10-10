<?php

namespace App\Exports;

use App\Models\Voter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VotersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $classDept;

    public function __construct($classDept = null)
    {
        $this->classDept = $classDept;
    }

    public function collection()
    {
        $query = Voter::orderBy('class_dept', 'asc')->orderBy('name', 'asc');

        if ($this->classDept) {
            $query->where('class_dept', $this->classDept);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'NIS / NIP',
            'Token Akses',
            'Nama Lengkap',
            'Peran (Role)',
            'Kelas / Jabatan',
            'Status Hak Pilih',
            'Waktu Mencoblos',
        ];
    }

    public function map($voter): array
    {
        return [
            $voter->id,
            $voter->nis ?: '-',
            $voter->token,
            $voter->name,
            ucfirst($voter->role),
            $voter->class_dept ?: '-',
            $voter->status_voted ? 'SUDAH MEMILIH' : 'BELUM MEMILIH',
            $voter->voted_at ? $voter->voted_at->setTimezone('Asia/Jakarta')->format('d/m/Y H:i:s') . ' WIB' : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF2563EB'],
                ],
            ],
        ];
    }
}
