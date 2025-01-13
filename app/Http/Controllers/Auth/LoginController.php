<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{
    /**
     * Show the login form (untuk tampilan login jika menggunakan form biasa)
     * 
     * @return \Illuminate\View\View
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    

    /**
     * Handle login attempt via API
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validasi input email dan password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        // Ambil kredensial login dari request
        $credentials = $request->only('email', 'password');

        try {
            // Coba untuk menghasilkan token JWT berdasarkan kredensial
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        // Ambil data user yang berhasil login
        $user = auth()->user();

        // Jika login berhasil, kembalikan token JWT dan informasi user
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'redirect_url' => route('project.index'), // Route ke halaman project
            'message' => 'Login berhasil',
            'token' => $token
        ], 200);
    }

}