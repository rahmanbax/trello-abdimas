<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';
    protected $primaryKey = 'idproject';
    protected $fillable = ['nama_project', 'iduser', 'updated_at'];

    /**
     * Relasi ke owner (user)
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'iduser', 'id');
    }

    /**
     * Relasi ke tasks
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'idproject', 'idproject');
    }

    /**
     * Relasi ke collaborators
     */
    public function collaborators()
    {
        return $this->hasMany(Collaborator::class, 'project_id', 'idproject');
    }

    /**
     * Relasi ke users melalui collaborators
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'collaborators', 'project_id', 'user_id')
            ->withTimestamps();
    }
}