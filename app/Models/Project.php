<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects'; // Nama tabel
    protected $primaryKey = 'idproject'; // Primary key
    protected $fillable = ['nama_project', 'iduser', 'updated_at']; // Kolom yang bisa diisi

    /**
     * Relasi ke model Task
     * Satu project memiliki banyak tasks (One to Many).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'iduser');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'idproject', 'idproject');
    }

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class, 'project_id', 'idproject');
    }
}
