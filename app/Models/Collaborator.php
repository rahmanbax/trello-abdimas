<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    use HasFactory;

    protected $table = 'collaborators';
    
    // Jika primary key bukan 'id', sesuaikan
    // protected $primaryKey = 'id_collaborator';

    protected $fillable = [
        'project_id',
        'user_id',
    ];

    // Relasi ke Project
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'idproject');
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}