<?php

namespace App\Http\Controllers;

use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoothController extends Controller
{
    /**
     * Tampilkan layar utama Bilik Suara (Standby).
     */
    public function index(Request $request)
    {
        // Jika pemilih masih punya session aktif dan belum vote, bisa langsung ke bilik
        $voterId = $request->session()->get('voter_id');
        if ($voterId) {
            $voter = Voter::find($voterId);
            if ($voter && !$voter->status_voted) {
                return redirect()->route('candidate');
            }
            $request->session()->forget(['voter_id', 'voter']);
        }

        return Inertia::render('Booth/Login');
    }

    /**
     * Validasi Scan QR (NIS) atau Input Manual (Token).
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'type' => 'required|in:scan,token',
            'value' => 'required|string|max:50',
        ]);

        $type = $request->type;
        $input = trim($request->value);

        if ($type === 'scan') {
            $voter = Voter::where('nis', $input)->first();
            $typeLabel = 'NIS';
        } else {
            $voter = Voter::where('token', strtoupper($input))->first();
            $typeLabel = 'Token';
        }

        if (!$voter) {
            return back()->withErrors([
                'auth_error' => "{$typeLabel} \"{$input}\" tidak terdaftar dalam DPT.",
            ]);
        }

        if ($voter->status_voted) {
            return back()->withErrors([
                'voted_error' => "Pemilih {$voter->name} ({$voter->class_dept}) sudah menggunakan hak pilih.",
            ]);
        }

        // Simpan sesi pemilih sementara
        $request->session()->put('voter_id', $voter->id);
        $request->session()->put('voter', [
            'id' => $voter->id,
            'nis' => $voter->nis,
            'token' => $voter->token,
            'name' => $voter->name,
            'class_dept' => $voter->class_dept,
            'role' => $voter->role,
        ]);

        return redirect()->route('candidate');
    }

    /**
     * Batalkan sesi bilik suara pemilih (kembali ke standby).
     */
    public function cancel(Request $request)
    {
        $request->session()->forget(['voter_id', 'voter']);
        return redirect()->route('booth');
    }
}
