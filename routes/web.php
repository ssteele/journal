<?php

use App\Http\Controllers\EntryController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\MentionController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\TagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/entries/today', [EntryController::class, 'today'])->name('entries.today');
    Route::get('/entries/next/{date}', [EntryController::class, 'next'])->name('entries.next');
    Route::get('/entries/search', [EntryController::class, 'search'])->name('entries.search');
    Route::get('/entries/upload', [EntryController::class, 'createUpload'])->name('entries.create-upload');
    Route::get('/entries/export', [EntryController::class, 'createExport'])->name('entries.create-export');
    Route::get('/entries/download', [EntryController::class, 'downloadExport'])->name('entries.download-export');
    Route::post('/entries/upload', [EntryController::class, 'storeUpload'])->name('entries.store-upload');
});
Route::resource('entries', EntryController::class);

Route::resource('snippets', SnippetController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::get('/tags/{tag}', [TagController::class, 'show'])->name('tags.show');
    Route::get('/tags/{tag1}/{tag2}', [TagController::class, 'compare'])->name('tags.compare');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/mentions', [MentionController::class, 'index'])->name('mentions.index');
    Route::get('/mentions/{mention}', [MentionController::class, 'show'])->name('mentions.show');
    Route::get('/mentions/{mention1}/{mention2}', [MentionController::class, 'compare'])->name('mentions.compare');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/markers', [MarkerController::class, 'index'])->name('markers.index');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

require __DIR__.'/auth.php';
