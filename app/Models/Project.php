<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects'; // Nama tabel
    protected $primaryKey = 'idproject'; // Primary key
    protected $fillable = ['nama_project','iduser']; // Kolom yang bisa diisi secara massal

    /**
     * Relasi ke model Task
     * Satu project memiliki banyak tasks (One to Many).
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'idproject', 'idproject');
    }
}

