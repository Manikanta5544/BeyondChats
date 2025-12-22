<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'source',
        'title',
        'original_url',
        'original_content',
        'enhanced_content',
        'status',
        'reference_urls',
        'scraped_at',
        'enhanced_at',
    ];

    protected $casts = [
        'reference_urls' => 'array',
        'scraped_at' => 'datetime',
        'enhanced_at' => 'datetime',
    ];
}
