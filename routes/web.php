<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckJwtToken;
use Illuminate\Support\Facades\Log;


// Route yang aman TANPA middleware
Route::get('/login', function () {
    return view('auth.login');
});

Route::get('/register', function () {
    return view('auth.register');
});

Route::fallback(function () {
    return redirect('/project');
});

// Route yang butuh JWT
Route::middleware([CheckJwtToken::class])->group(function () {

    Route::get('/project', function () {
        return view('project.index');
    });

    Route::get('/project/{id}', function ($id) {
        return view('project.detail', ['id' => $id]);
    });
});
