<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user(); // Mendapatkan pengguna yang sedang login
        return response()->json([
            'id' => $user->id,
            'name' => $user->name, // Menampilkan nama pengguna
            'email' => $user->email, // Menampilkan email pengguna
        ], 200);
    }
}