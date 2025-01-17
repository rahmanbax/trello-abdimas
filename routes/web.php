<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProjectController;

// Project Routes (accessible after login)
Route::get('/project', function () {
    return view('project.index');
});

Route::get('/project/{id}', function ($id) {
    return view('project.detail', ['id' => $id]);
});

// Project Routes (accessible after login)
Route::get('/login', function () {
    return view('auth.login');
});

Route::get('/register', function () {
    return view('auth.register');
});
