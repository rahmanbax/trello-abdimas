<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    use HasFactory;

    // Jika nama tabel tidak standar (bukan 'collaborators'), definisikan seperti ini:
    protected $table = 'collaborators';

    // Tentukan atribut yang boleh diisi massal (mass assignable)
    protected $fillable = [
        'project_id',
        'user_id',
    ];

    // Relasi ke Project
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}