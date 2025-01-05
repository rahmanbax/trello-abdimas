<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;

// Authentication Routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

// Protected Routes for Authenticated Users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Project Routes (accessible after login)
    Route::get('/project', function () {
        return view('project.index'); 
    });

    Route::get('/project/{id}', function ($id) {
        return view('project.detail', ['id' => $id]); 
    });
});

<<<<<<< HEAD
// Redirect to Login Page if not authenticated (optional)
Route::get('/', function () {
    return redirect()->route('login'); 
=======

Route::get('/project', function () {
    return view('project.index'); 
>>>>>>> 1bb71edf16ce6da59b21651bdf421317d768b6e8
});

Route::get('/project/{id}', function () {
    return view('project.detail'); 
});