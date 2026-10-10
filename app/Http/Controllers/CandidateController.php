<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CandidateController extends Controller
{
    /**
     * Tampilkan daftar paslon di bilik suara untuk pemilih aktif.
     */
    public function index(Request $request)
    {
        $candidates = Candidate::orderBy('candidate_number', 'asc')->get();

        return Inertia::render('CandidateList', [
            'candidates' => $candidates,
            'voter' => $request->session()->get('voter'),
        ]);
    }

    /**
     * Proses pencoblosan paslon (DB Transaction & Luber Jurdil).
     */
    public function vote(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $voterId = $request->session()->get('voter_id');

        if (!$voterId) {
            return redirect()->route('booth')->with('error', 'Sesi bilik suara telah berakhir. Silakan scan ulang.');
        }

        try {
            $selectedCandidate = DB::transaction(function () use ($request, $voterId) {
                // Lock voter row untuk mencegah race condition double vote
                $voter = Voter::lockForUpdate()->find($voterId);

                if (!$voter || $voter->status_voted) {
                    throw new \Exception('Hak suara Anda telah digunakan sebelumnya.');
                }

                // 1. Catat status pemilih sudah memilih
                $voter->update([
                    'status_voted' => true,
                    'voted_at' => now(),
                ]);

                // 2. Tambah suara kandidat secara terpisah (tanpa foreign key ke voter)
                $candidate = Candidate::lockForUpdate()->find($request->candidate_id);
                $candidate->increment('vote_count');

                return $candidate;
            });

            // Simpan informasi kandidat yang dicoblos hanya untuk ditampilkan di halaman konfirmasi sukses
            $request->session()->put('voted_candidate', [
                'name' => $selectedCandidate->name,
                'candidate_number' => $selectedCandidate->candidate_number,
                'photo' => $selectedCandidate->photo,
            ]);

            // Bersihkan sesi aktif pemilih dari bilik suara
            $request->session()->forget(['voter_id', 'voter']);

            return redirect()->route('vote.success');

        } catch (\Exception $e) {
            Log::error('Voting Booth Error: ' . $e->getMessage());
            $request->session()->forget(['voter_id', 'voter']);

            return redirect()->route('booth')->with('error', $e->getMessage() ?: 'Terjadi kesalahan saat memproses suara.');
        }
    }

    /**
     * Halaman ucapan terima kasih / konfirmasi sukses.
     */
    public function success(Request $request)
    {
        $votedCandidate = $request->session()->get('voted_candidate');

        return Inertia::render('VoteSuccess', [
            'candidate' => $votedCandidate,
        ]);
    }
}
