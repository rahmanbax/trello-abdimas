<?php

use Illuminate\Support\Facades\Route;


Route::get('/project', function () {
    return view('project.index');
});

Route::get('/project/{id}', function ($id) {
    return view('project.detail', ['id' => $id]);
});

Route::get('/login', function () {
    return view('auth.login');
});

Route::get('/register', function () {
    return view('auth.register');
});
