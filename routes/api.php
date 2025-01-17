<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
<<<<<<< HEAD

// Rute untuk API Resource
Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);

// Rute untuk autentikasi
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Rute grup untuk autentikasi
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('projects', [ProjectController::class, 'index']); // Example: Fetching all projects (or customize as needed)
    Route::get('project', [ProjectController::class, 'show']); // Example: Fetching a specific project (or customize as needed)
});


// Rute untuk register dan login
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Rute untuk profil pengguna yang terautentikasi
Route::middleware('auth:api')->get('user', [AuthController::class, 'userProfile']);
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
Route::middleware('auth:api')->post('refresh', [AuthController::class, 'refresh']);
Route::post('auth/login', [AuthController::class, 'login']);
=======
use App\Http\Controllers\UserController;

Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('users', UserController::class);
});
 
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api')->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api')->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->middleware('auth:api')->name('me');
});


>>>>>>> save
