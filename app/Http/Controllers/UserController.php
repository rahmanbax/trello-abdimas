<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user(); // Mendapatkan pengguna yang sedang login
        return response()->json([
            'name' => $user->name, // Menampilkan nama pengguna
        ], 200);
    }

}
