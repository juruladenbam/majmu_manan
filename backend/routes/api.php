<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\Admin\BacaanController as AdminBacaanController;

use App\Http\Controllers\Api\Admin\SectionController as AdminSectionController;

use App\Http\Controllers\Api\Admin\ItemController as AdminItemController;

use App\Http\Controllers\Api\Public\BacaanController as PublicBacaanController;



// Auth

Route::post('/login', [AuthController::class, 'login']);



// Public Read-Only

Route::get('/bacaan', [PublicBacaanController::class, 'index']);

Route::get('/bacaan/{slug}', [PublicBacaanController::class, 'show']);

Route::get('/bacaan/{slug}/{section_slug}', [PublicBacaanController::class, 'showSection']);



// Admin Protected

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);



    // Admin CRUD

    Route::apiResource('admin/bacaan', AdminBacaanController::class);

    Route::apiResource('admin/sections', AdminSectionController::class)->except(['index', 'show']); // Managed via Bacaan detail usually

    Route::apiResource('admin/items', AdminItemController::class)->except(['index', 'show']);

});
