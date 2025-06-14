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

    public function searchUser(Request $request)
    {
        $q = $request->query('q');

        if (!$q || strlen($q) < 2) {
            return response()->json([]);
        }

        $users = User::where('username', 'like', "%{$q}%")
            ->limit(10)
            ->pluck('username');

        return response()->json($users);
    }


}