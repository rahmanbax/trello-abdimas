<?php

use Illuminate\Support\Facades\Route;


// Project Routes (accessible after login)
// Route::middleware(['auth:api'])->group(function () {
    Route::get('/project', function () {
        return view('project.index');
    });

    Route::get('/project/{id}', function ($id) {
        return view('project.detail', ['id' => $id]);
    });
// });

Route::get('/login', function () {
    return view('auth.login');
});
