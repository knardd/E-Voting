<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'nis',
        'token',
        'name',
        'role',
        'class_dept',
        'status_voted',
        'voted_at',
    ];

    protected function casts(): array
    {
        return [
            'status_voted' => 'boolean',
            'voted_at' => 'datetime',
        ];
    }

    /**
     * Generate a unique uppercase alphanumeric token (e.g. 6 characters).
     */
    public static function generateUniqueToken(int $length = 6): string
    {
        $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Hindari karakter membingungkan seperti 0/O, 1/I
        do {
            $token = '';
            for ($i = 0; $i < $length; $i++) {
                $token .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (self::where('token', $token)->exists());

        return $token;
    }
}
