<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index()
    {
        $candidates = Candidate::orderBy('candidate_number', 'asc')->get();

        return Inertia::render('Admin/CreateCandidate', [
            'candidates' => $candidates,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'candidate_number' => 'required|integer|min:1|unique:candidates,candidate_number',
            'name' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('candidates', 'public');
        }

        Candidate::create([
            'candidate_number' => $request->candidate_number,
            'name' => $request->name,
            'visi' => $request->visi,
            'misi' => $request->misi,
            'photo' => $photoPath,
            'vote_count' => 0,
        ]);

        return redirect()->back()->with('success', 'Kandidat berhasil ditambahkan!');
    }

    public function update(Request $request, Candidate $candidate)
    {
        $request->validate([
            'candidate_number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('candidates', 'candidate_number')->ignore($candidate->id),
            ],
            'name' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = $candidate->photo;
        if ($request->hasFile('photo')) {
            if ($candidate->photo && Storage::disk('public')->exists($candidate->photo)) {
                Storage::disk('public')->delete($candidate->photo);
            }
            $photoPath = $request->file('photo')->store('candidates', 'public');
        }

        $candidate->update([
            'candidate_number' => $request->candidate_number,
            'name' => $request->name,
            'visi' => $request->visi,
            'misi' => $request->misi,
            'photo' => $photoPath,
        ]);

        return redirect()->back()->with('success', 'Data kandidat berhasil diperbarui!');
    }

    public function destroy(Candidate $candidate)
    {
        if ($candidate->photo && Storage::disk('public')->exists($candidate->photo)) {
            Storage::disk('public')->delete($candidate->photo);
        }

        $candidate->delete();

        return redirect()->back()->with('success', 'Kandidat berhasil dihapus!');
    }
}
