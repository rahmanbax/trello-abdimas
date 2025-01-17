<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            // Membuat user baru
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);

            // Menghasilkan token JWT untuk pengguna baru
            $token = JWTAuth::fromUser($user);

            return $this->respondWithToken($token);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login user.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // Ambil kredensial untuk login
        $credentials = $request->only('email', 'password');

        try {
            // Cek apakah kredensial valid
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Jika valid, kembalikan token JWT
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60, // Waktu kadaluarsa dalam menit
            ]);

        } catch (JWTException $e) {
            // Jika ada kesalahan dalam pembuatan token
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    /**
     * Get the authenticated user.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile()
    {
        try {
            // Ambil data pengguna yang sudah terautentikasi
            $user = JWTAuth::user();
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve user',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Log the user out (invalidate the token).
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Refresh a token.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            // Refresh token JWT
            $newToken = JWTAuth::refresh(JWTAuth::getToken());
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to refresh token', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the token array structure.
     * 
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // TTL default dalam menit
        ]);
    }

    public function getAuthenticatedUser()
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json($user);
    } catch (JWTException $e) {
        return response()->json(['error' => 'User not found or token invalid'], 401);
    }
}


}