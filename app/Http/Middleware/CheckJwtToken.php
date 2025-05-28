<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class CheckJwtToken
{
    public function handle($request, Closure $next)
    {
        Log::info("=============== CHECK JWT TOKEN - START ================");
        Log::info("Path: " . $request->path());
        Log::info("Method: " . $request->method());
        Log::info("Request Headers: ", $request->headers->all());

        // !!! TAMBAHKAN LOG INI UNTUK MELIHAT NILAI LEEWAY !!!
        $configuredLeeway = config('jwt.leeway');
        Log::debug('NILAI LEEWAY YANG DIKONFIGURASI (dari config(\'jwt.leeway\')): ' . $configuredLeeway);
        Log::debug('TIPE DATA LEEWAY: ' . gettype($configuredLeeway));
        // !!! AKHIR DARI LOG TAMBAHAN !!!

        // Ambil token dari cookie (nama: token)
        $token = $request->cookie('token');
        Log::debug("Token from cookie: " . ($token ?? 'NULL'));


        if (!$token) {
            Log::warning("TOKEN NOT FOUND in cookie. Redirecting to /login.");
            Log::info("=============== CHECK JWT TOKEN - END (FAIL) ================");
            return redirect('/login');
        }

        try {
            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                Log::warning("USER NOT FOUND from token.");
                return redirect('/login');
            }

            // Simpan user ke request kalau perlu
            $request->merge(['user' => $user]);
        } catch (JWTException $e) {
            Log::error("JWT Exception: " . $e->getMessage());
            return redirect('/login');
        }

        Log::info("=============== CHECK JWT TOKEN - END (OK) ================");
        return $next($request);
    }
}
