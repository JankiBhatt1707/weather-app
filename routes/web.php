<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

// Unauthenticated Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/', [LoginController::class, 'show'])->name('login');
    Route::post('/', [LoginController::class, 'store']);
});

// Authenticated Session Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [WeatherController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/city', [WeatherController::class, 'updateCity'])->name('dashboard.city');
    Route::post('/dashboard/refresh', [WeatherController::class, 'refresh'])->name('dashboard.refresh');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});


