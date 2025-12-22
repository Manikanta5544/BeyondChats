<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('source', 50)->default('beyondchats');
            $table->string('title', 500);
            $table->text('original_url')->nullable();
            $table->longText('original_content');
            $table->longText('enhanced_content')->nullable();
            $table->string('status', 20)->default('original');
            $table->json('reference_urls')->nullable();
            $table->timestamp('scraped_at')->nullable();
            $table->timestamp('enhanced_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('source');
            $table->index('created_at');
        });

        DB::statement(
            "ALTER TABLE articles
            ADD CONSTRAINT articles_status_check
            CHECK (status IN ('original', 'enhanced'))"
        );
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
