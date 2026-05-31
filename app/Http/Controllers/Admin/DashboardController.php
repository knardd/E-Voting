<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vote;
use App\Models\Candidate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $colorPalette = [
        ['bg-blue-500', '#3b82f6'],   // Kandidat 1
        ['bg-indigo-500', '#6366F1'], // Kandidat 2
        ['bg-violet-500', '#8B5CF6'],   // Kandidat 3
        ['bg-green-500', '#22C55E'],   // Kandidat 4
        ['bg-amber-500', '#f59e0b'],  // Kandidat 5
    ];

    public function index()
    {
        // 1. Ambil Statistik Dasar
        $totalUsers = User::count();
        $voted = Vote::distinct('user_id')->count('user_id');
        $notVoted = $totalUsers - $voted;

        // 2. Ambil Kandidat & Hitung Suara
        $candidatesData = Candidate::withCount('votes')->get();
        $totalVotes = $candidatesData->sum('votes_count');
        
        $realMax = $candidatesData->max('votes_count') ?: 0;
        $chartMax = (ceil(($realMax + 1) / 10) * 10);
        if ($chartMax == 0) $chartMax = 10;

        $stepSize = $chartMax / 5;
        $chartSteps = [];
        for ($i = 5; $i >= 1; $i--) {
            $chartSteps[] = round($stepSize * $i);
        }

        // 3. Proses Data Kandidat & Siapkan Visualisasi
        $processedCandidates = [];
        $gradientStops = [];
        $currentAngle = 0;

        foreach ($candidatesData as $index => $candidate) {
            $colorIndex = $index % count($this->colorPalette);
            $colorClass = $this->colorPalette[$colorIndex][0];
            $colorHex = $this->colorPalette[$colorIndex][1];

            $percentage = $totalVotes > 0 
                ? round(($candidate->votes_count / $totalVotes) * 100, 1) 
                : 0;

            $heightPercentage = ($candidate->votes_count / $chartMax) * 100;

            $processedCandidates[] = [
                'name' => $candidate->name,
                'votes' => $candidate->votes_count,
                'percentage' => $percentage,
                'height' => round($heightPercentage),
                'color_class' => $colorClass,
                'color_hex' => $colorHex,
            ];

            if ($totalVotes > 0) {
                $endAngle = $currentAngle + $percentage;
                $gradientStops[] = "{$colorHex} {$currentAngle}% {$endAngle}%";
                $currentAngle = $endAngle;
            }
        }

        $pieChartGradient = $totalVotes > 0 
            ? implode(', ', $gradientStops) 
            : '#e5e7eb 0% 100%';

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'voted' => $voted,
                'notVoted' => $notVoted,
                'totalVotes' => $totalVotes,
            ],
            'candidates' => $processedCandidates,
            'chart' => [
                'max' => $chartMax,
                'steps' => $chartSteps,
                'pieGradient' => $pieChartGradient,
            ]
        ]);
    }
}
