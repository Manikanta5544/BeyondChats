<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::latest()->get();
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
