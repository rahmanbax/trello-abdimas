<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/project', function () {
    return view('project.index'); 
});

Route::get('/project/{id}', function () {
    return view('project.detail'); 
});