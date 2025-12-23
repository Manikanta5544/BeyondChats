<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

Route::get('articles/latest', [ArticleController::class, 'latest']);
Route::apiResource('articles', ArticleController::class);
Route::post('/internal/scrape', function () {
    abort_unless(
        request()->header('X-ADMIN-TOKEN') === config('app.admin_token'),
        403
    );

    Artisan::call('scrape:blogs', ['--limit' => 5]);

    return response()->json([
        'status' => 'ok',
        'message' => 'Scraping triggered'
    ]);
});
