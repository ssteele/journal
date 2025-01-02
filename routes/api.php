<?php

use App\Http\Controllers\API\EntryController;
use App\Http\Controllers\API\SnippetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/entries/more/{id}',[EntryController::class, 'moreEntries'])->name('api.entries.more');
    Route::get('/entries/list', [EntryController::class, 'getList'])->name('api.entries.list');
    Route::get('/entries/{id}', [EntryController::class, 'get'])->name('api.entries.id');

    Route::post('/snippets/update-order', [SnippetController::class, 'updateOrder'])->name('api.snippets.update-order');
});

// one-off
// Route::middleware('auth:sanctum')->get('/entries/{id}', [EntryController::class, 'get'])->name('api.entries.id');
