<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index()
    {
        $candidates = Candidate::orderBy('id')->get();

        return Inertia::render('Admin/CreateCandidate', [
            'candidates' => $candidates,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'photo' => 'required|image|max:2048',
        ]);

        $photoPath = $request->file('photo')->store('candidates', 'public');

        Candidate::create([
            'name' => $request->name,
            'visi' => $request->visi,
            'misi' => $request->misi,
            'photo' => $photoPath,
        ]);

        return redirect()->back()->with('success', 'Kandidat berhasil ditambahkan!');
    }

    public function update(Request $request, Candidate $candidate)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visi' => 'required|string',
            'misi' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = $candidate->photo;
        if ($request->hasFile('photo')) {
            if ($candidate->photo) {
                Storage::disk('public')->delete($candidate->photo);
            }
            $photoPath = $request->file('photo')->store('candidates', 'public');
        }

        $candidate->update([
            'name' => $request->name,
            'visi' => $request->visi,
            'misi' => $request->misi,
            'photo' => $photoPath,
        ]);

        return redirect()->back()->with('success', 'Kandidat berhasil diperbarui!');
    }

    public function destroy(Candidate $candidate)
    {
        if ($candidate->photo) {
            Storage::disk('public')->delete($candidate->photo);
        }
        $candidate->delete();

        return redirect()->back()->with('success', 'Kandidat berhasil dihapus!');
    }
}
