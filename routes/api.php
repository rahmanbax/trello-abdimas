<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


// Route::apiResource('projects', ProjectController::class);
// Route::apiResource('tasks', TaskController::class);

Route::group(['middleware' => 'auth:api'], function () {
    Route::apiResource('projects', ProjectController::class); // Menambahkan middleware auth:api
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


