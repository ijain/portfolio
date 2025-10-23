<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\TokenController;
use App\Http\Controllers\Auth\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::get('/user', [UserController::class, 'current']); // current user
});

Route::get('/v1/test-token', [TokenController::class, 'generateTestToken']);
Route::post('/v1/token', [TokenController::class, 'generateToken']);
