<?php

namespace App\Http\Middleware;

use App\Models\Voter;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasNotVoted
{
    /**
     * Handle an incoming request for the voting booth.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $voterId = $request->session()->get('voter_id');

        if (!$voterId) {
            return redirect()->route('booth')->with('error', 'Silakan scan kartu atau masukkan token terlebih dahulu.');
        }

        $voter = Voter::find($voterId);

        if (!$voter) {
            $request->session()->forget(['voter_id', 'voter']);
            return redirect()->route('booth')->with('error', 'Data pemilih tidak ditemukan.');
        }

        if ($voter->status_voted) {
            $request->session()->forget(['voter_id', 'voter']);
            return redirect()->route('booth')->with('error', "Pemilih {$voter->name} sudah menggunakan hak pilih.");
        }

        return $next($request);
    }
}
