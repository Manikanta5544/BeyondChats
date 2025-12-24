<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;


class ArticleController extends Controller
{
    public function index()
    {
        if (Article::count() === 0 && !cache()->has('beyondchats_scraped')) {
            try {
                Artisan::call('scrape:blogs', [
                    '--limit' => 5,
                ]);

                cache()->forever('beyondchats_scraped', true);
            } catch (\Throwable $e) {
                logger()->error('Initial blog scrape failed', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return Article::orderBy('created_at')->get();
    }


    public function show(Article $article)
    {
        return $article;
    }

    public function latest()
    {
        return Article::latest()->firstOrFail();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'original_content' => 'required|string',
            'original_url' => 'nullable|string',
        ]);

        return Article::create($data);
    }

    public function update(Request $request, Article $article)
    {
        $article->update($request->all());
        return $article;
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->noContent();
    }
}
