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
    Route::get('/entries/upload', [EntryController::class, 'createUpload'])->name('entries.create-upload');
    Route::post('/entries/upload', [EntryController::class, 'storeUpload'])->name('entries.store-upload');
    Route::get('/entries/more/{id}',[EntryController::class, 'moreEntries'])->name('entries.more');
});
Route::resource('entries', EntryController::class);

Route::resource('snippets', SnippetController::class);

Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
Route::get('/tags/{tag}', [TagController::class, 'show'])->name('tags.show');

Route::get('/mentions', [MentionController::class, 'index'])->name('mentions.index');
Route::get('/mentions/{mention}', [MentionController::class, 'show'])->name('mentions.show');

Route::get('/markers', [MarkerController::class, 'index'])->name('markers.index');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

require __DIR__.'/auth.php';
