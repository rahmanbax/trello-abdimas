<?php
use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProjectController;

// Public Authentication Routes
Route::get('/', fn() => redirect()->route('login'));
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

// API Routes
Route::prefix('api')->group(function () {
    Route::post('login', [LoginController::class, 'login']);
    Route::post('register', [RegisterController::class, 'register']);

    // Protected API Routes
    Route::middleware('auth')->group(function () {
        Route::get('/projects', [ProjectController::class, 'index'])->name('project.index');
        Route::post('/projects', [ProjectController::class, 'store'])->name('project.store');
        Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('project.show');
        Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('project.update');
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('project.destroy');
        Route::get('/projects/{id}/detail', [ProjectController::class, 'showDetail'])->name('project.showDetail');
    });
=======


Route::get('/project', function () {
    return view('project.index');
})->middleware('auth');

Route::get('/project/{id}', function ($id) {
    return view('project.detail', ['id' => $id]);
});

Route::get('/login', function () {
    return view('auth.login');
});

Route::get('/register', function () {
    return view('auth.register');
>>>>>>> save
});

Route::get('/projects', [ProjectController::class, 'index'])->name('project');


// Web Routes for Logged-In Users
Route::middleware('auth:api')->group(function () {
    Route::get('/project', [ProjectController::class, 'index'])->name('project.index');
    Route::get('/project/{id}', [ProjectController::class, 'show'])->name('project.show');
});

Route::middleware('auth:api')->group(function () {
    Route::get('/project', [ProjectController::class, 'index'])->name('project.index');
});


Route::get('auth/login', [AuthController::class, 'showLoginForm']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/login', 'AuthController@login');
