<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks'; // Nama tabel
    protected $primaryKey = 'idtask'; // Primary key
    protected $fillable = ['nama_task', 'status', 'idproject']; // Kolom yang bisa diisi secara massal

    /**
     * Relasi dengan model Project
     * Setiap task dimiliki oleh satu project.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'idproject', 'idproject');
    }
}
