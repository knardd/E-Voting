<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CandidateController extends Controller
{
    public function index()
    {
        $candidates = Candidate::all();
        
        return Inertia::render('CandidateList', [
            'candidates' => $candidates,
        ]);
    }

    public function success()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $vote = Vote::with('candidate')->where('user_id', $user->id)->first();
        
        return Inertia::render('VoteSuccess', [
            'candidate' => $vote ? $vote->candidate : null,
        ]);
    }

    public function vote(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu');
        }
        
        try {
            DB::transaction(function () use ($request, $user) {
                // Simpan vote
                Vote::create([
                    'user_id' => $user->id,
                    'candidate_id' => $request->candidate_id,
                ]);

                // Update status has_voted
                $user->update(['has_voted' => true]);
            });

            return redirect()->route('vote.success');
            
        } catch (\Exception $e) {
            Log::error('Voting Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan vote.');
        }
    }
}
