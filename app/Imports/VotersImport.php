<?php

namespace App\Imports;

use App\Models\Voter;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class VotersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $nis = isset($row['nis']) && !empty(trim((string)$row['nis'])) ? trim((string)$row['nis']) : null;
        $name = isset($row['nama']) ? trim((string)$row['nama']) : (isset($row['name']) ? trim((string)$row['name']) : 'Tanpa Nama');
        $classDept = isset($row['kelas']) ? trim((string)$row['kelas']) : (isset($row['class_dept']) ? trim((string)$row['class_dept']) : (isset($row['jabatan']) ? trim((string)$row['jabatan']) : null));
        $role = isset($row['role']) && in_array(strtolower(trim((string)$row['role'])), ['siswa', 'guru', 'staf']) 
            ? strtolower(trim((string)$row['role'])) 
            : 'siswa';

        // Jika NIS sudah terdaftar, update saja namanya/kelasnya tanpa mereset token
        if ($nis) {
            $existing = Voter::where('nis', $nis)->first();
            if ($existing) {
                $existing->update([
                    'name' => $name,
                    'class_dept' => $classDept,
                    'role' => $role,
                ]);
                return null;
            }
        }

        return new Voter([
            'nis' => $nis,
            'token' => Voter::generateUniqueToken(),
            'name' => $name,
            'role' => $role,
            'class_dept' => $classDept,
            'status_voted' => false,
            'voted_at' => null,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.nama' => ['nullable', 'string'],
            '*.name' => ['nullable', 'string'],
        ];
    }
}
