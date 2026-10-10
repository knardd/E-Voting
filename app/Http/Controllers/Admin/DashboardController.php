<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Voter;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalVoters = Voter::count();
        $votedCount = Voter::where('status_voted', true)->count();
        $notVotedCount = $totalVoters - $votedCount;
        $participationPercentage = $totalVoters > 0 ? round(($votedCount / $totalVoters) * 100, 1) : 0;

        $candidates = Candidate::orderBy('candidate_number', 'asc')->get();
        $totalVotes = $candidates->sum('vote_count');

        // Statistik per kelas
        $classStats = Voter::select('class_dept', DB::raw('count(*) as total'), DB::raw('sum(case when status_voted = 1 then 1 else 0 end) as voted'))
            ->whereNotNull('class_dept')
            ->groupBy('class_dept')
            ->orderBy('class_dept', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'class_dept' => $row->class_dept,
                    'total' => (int) $row->total,
                    'voted' => (int) $row->voted,
                    'not_voted' => (int) ($row->total - $row->voted),
                    'percentage' => $row->total > 0 ? round(($row->voted / $row->total) * 100, 1) : 0,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalVoters' => $totalVoters,
                'voted' => $votedCount,
                'notVoted' => $notVotedCount,
                'participationRate' => $participationPercentage,
                'totalVotes' => $totalVotes,
            ],
            'candidates' => $candidates->map(fn($c) => [
                'id' => $c->id,
                'candidate_number' => $c->candidate_number,
                'name' => $c->name,
                'photo' => $c->photo,
                'vote_count' => $c->vote_count,
                'percentage' => $totalVotes > 0 ? round(($c->vote_count / $totalVotes) * 100, 1) : 0,
            ]),
            'classStats' => $classStats,
        ]);
    }
}
