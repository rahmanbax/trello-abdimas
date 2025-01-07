<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kkomelin\LaravelJwt\Facades\JwtAuth;
use Kkomelin\LaravelJwt\Exceptions\JwtException;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Validasi token JWT dari header Authorization
            $token = $request->header('Authorization');

            if (!$token || !JwtAuth::parseToken($token)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (JwtException $e) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
