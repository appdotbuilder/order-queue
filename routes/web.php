<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public barcode scanning for customers
Route::get('/scan', [ScanController::class, 'index'])->name('scan.index');
Route::post('/scan', [ScanController::class, 'store'])->name('scan.store');

// Public order creation (menu viewing)
Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - role-based
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Orders - all roles can view, customers can create (except create which is public)
    Route::resource('orders', OrderController::class)->except(['create']);
    
    // Stores - store owners only
    Route::resource('stores', StoreController::class);
    
    // Products - store owners and cashiers
    Route::resource('products', ProductController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';