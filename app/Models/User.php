<?php
 
namespace App\Models;
 
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
<<<<<<< HEAD

=======
 
>>>>>>> save
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;
 
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];
 
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
<<<<<<< HEAD
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function project()
    {
        return $this->hasMany(Project::class, 'iduser'); // Menggunakan kolom 'iduser' sebagai FK
    }

=======
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
 
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
>>>>>>> save
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
<<<<<<< HEAD

=======
 
>>>>>>> save
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> save
