<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $voted = User::where('has_voted', true)->count();
        $notVoted = $totalUsers - $voted;

        $candidates = Candidate::withCount('votes')->get();
        $totalVotes = $candidates->sum('votes_count');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'voted' => $voted,
                'notVoted' => $notVoted,
                'totalVotes' => $totalVotes,
            ],
            'candidates' => $candidates->map(fn($candidate) => [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'votes' => $candidate->votes_count,
            ]),
        ]);
    }
}
