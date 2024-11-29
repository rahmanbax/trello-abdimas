<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/depan', function () {
    return view('depan.index');  // Mengarah ke resources/views/index/index.blade.php
});
