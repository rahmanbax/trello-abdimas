<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';
    protected $primaryKey = 'idproject';
    protected $fillable = ['nama_project', 'iduser']; // Pastikan 'iduser' termasuk dalam $fillable

    /**
     * Relasi ke model User
     * Setiap project dimiliki oleh satu user (Many to One).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'iduser'); // Menggunakan kolom 'iduser' sebagai FK
    }

    /**
     * Relasi ke model Task
     * Satu project memiliki banyak tasks (One to Many).
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'idproject', 'idproject');
    }
}

