<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_number',
        'name',
        'visi',
        'misi',
        'photo',
        'vote_count',
    ];

    protected function casts(): array
    {
        return [
            'candidate_number' => 'integer',
            'vote_count' => 'integer',
        ];
    }
}
