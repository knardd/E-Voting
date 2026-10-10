<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ElectionResultsExport;
use App\Exports\VotersExport;
use App\Http\Controllers\Controller;
use App\Imports\VotersImport;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class VoterController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $classFilter = $request->input('class_dept');
        $statusFilter = $request->input('status');

        $query = Voter::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('token', 'like', "%{$search}%");
            });
        }

        if ($classFilter) {
            $query->where('class_dept', $classFilter);
        }

        if ($statusFilter !== null && $statusFilter !== '') {
            $query->where('status_voted', $statusFilter === '1' || $statusFilter === 'true');
        }

        $voters = $query->orderBy('class_dept', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(50)
            ->withQueryString();

        $classes = Voter::whereNotNull('class_dept')
            ->distinct()
            ->orderBy('class_dept', 'asc')
            ->pluck('class_dept');

        return Inertia::render('Admin/CreateUser', [
            'voters' => $voters,
            'classes' => $classes,
            'filters' => [
                'search' => $search,
                'class_dept' => $classFilter,
                'status' => $statusFilter,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nis' => 'nullable|string|max:50|unique:voters,nis',
            'class_dept' => 'nullable|string|max:100',
            'role' => 'required|in:siswa,guru,staf',
        ]);

        Voter::create([
            'nis' => $request->nis ? trim($request->nis) : null,
            'token' => Voter::generateUniqueToken(),
            'name' => $request->name,
            'role' => $request->role,
            'class_dept' => $request->class_dept,
            'status_voted' => false,
            'voted_at' => null,
        ]);

        return redirect()->back()->with('success', 'Data pemilih berhasil ditambahkan!');
    }

    public function update(Request $request, Voter $voter)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nis' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('voters', 'nis')->ignore($voter->id),
            ],
            'class_dept' => 'nullable|string|max:100',
            'role' => 'required|in:siswa,guru,staf',
        ]);

        $voter->update([
            'nis' => $request->nis ? trim($request->nis) : null,
            'name' => $request->name,
            'role' => $request->role,
            'class_dept' => $request->class_dept,
        ]);

        return redirect()->back()->with('success', 'Data pemilih berhasil diperbarui!');
    }

    public function resetVote(Voter $voter)
    {
        $voter->update([
            'status_voted' => false,
            'voted_at' => null,
        ]);

        return redirect()->back()->with('success', "Status hak pilih {$voter->name} berhasil direset.");
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();
        return redirect()->back()->with('success', 'Data pemilih berhasil dihapus!');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ]);

        try {
            Excel::import(new VotersImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data pemilih dari Excel berhasil diimpor!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengimpor file: ' . $e->getMessage());
        }
    }

    public function export(Request $request)
    {
        $classDept = $request->input('class_dept');
        $timestamp = now('Asia/Jakarta')->format('d-m-Y_His');
        $fileName = $classDept ? "data_pemilih_{$classDept}_{$timestamp}.xlsx" : "data_pemilih_lengkap_{$timestamp}.xlsx";

        return Excel::download(new VotersExport($classDept), $fileName);
    }

    public function exportResults()
    {
        $timestamp = now('Asia/Jakarta')->format('d-m-Y_His');
        return Excel::download(new ElectionResultsExport, "rekap_hasil_suara_osis_{$timestamp}.xlsx");
    }
}
