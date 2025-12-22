<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeBeyondChatsBlogs extends Command
{
    protected $signature = 'scrape:blogs {--limit=5}';
    protected $description = 'Scrape oldest BeyondChats blog articles';

    public function handle(): int
    {
        $limit = max(1, (int) $this->option('limit'));

        $client = HttpClient::create([
            'timeout' => 20,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (compatible; BeyondChatsScraper/1.0)',
            ],
        ]);

        $this->info('Fetching BeyondChats blog sitemap');

        // Fetch sitemap
        try {
            $xml = $client
                ->request('GET', 'https://beyondchats.com/post-sitemap.xml')
                ->getContent();
        } catch (\Throwable $e) {
            $this->error('Failed to fetch blog sitemap');
            return 1;
        }

        // Use XML parser
        $xmlObj = simplexml_load_string($xml);

        if (!$xmlObj) {
            $this->error('Invalid sitemap XML');
            return 1;
        }

        $xmlObj->registerXPathNamespace(
            's',
            'http://www.sitemaps.org/schemas/sitemap/0.9'
        );

        $locations = $xmlObj->xpath('//s:loc');

        if (empty($locations)) {
            $this->error('No blog URLs found in sitemap');
            return 1;
        }

        // Oldest first priority
        $urls = collect(array_map(fn ($loc) => (string) $loc, $locations))
            ->filter(fn ($url) =>
                !str_contains($url, '/category/') &&
                !str_contains($url, '/tag/')
            )
            ->reverse()
            ->take($limit)
            ->values();

        if ($urls->isEmpty()) {
            $this->error('No valid blog URLs after filtering');
            return 1;
        }

        $this->info('Selected ' . $urls->count() . ' oldest blog articles');
        $this->newLine();

        // Scrape every URL
        $scraped = 0;
        $skipped = 0;

        foreach ($urls as $url) {

            // Always show URL
            $this->line("Processing: {$url}");

            if (Article::where('original_url', $url)->exists()) {
                $this->line('→ Skipped (already exists)');
                $this->newLine();
                $skipped++;
                continue;
            }

            try {
                $html = $client->request('GET', $url)->getContent();
                $page = new Crawler($html);

                if ($page->filter('h1')->count() === 0) {
                    $this->line('→ Skipped (no title found)');
                    $this->newLine();
                    continue;
                }

                $title = trim($page->filter('h1')->first()->text());

                $content = null;
                foreach (['article', '.entry-content', 'main', '.content'] as $selector) {
                    if ($page->filter($selector)->count() > 0) {
                        $content = trim($page->filter($selector)->first()->html());
                        break;
                    }
                }

                if (!$content || strlen(strip_tags($content)) < 150) {
                    $this->line('→ Skipped (insufficient content)');
                    $this->newLine();
                    continue;
                }

                Article::create([
                    'source'           => 'beyondchats',
                    'title'            => $title,
                    'original_url'     => $url,
                    'original_content' => $content,
                    'scraped_at'       => now(),
                ]);

                $scraped++;
                $this->line("→ Scraped: {$title}");
                $this->newLine();

            } catch (\Throwable $e) {
                $this->line('→ Failed to scrape');
                $this->newLine();
            }
        }

        // Summary
        if ($scraped === 0) {
            $this->info(
                "Scraping completed. {$skipped} articles already existed. No new articles added."
            );
        } else {
            $this->info(
                "Scraping completed. {$scraped} new articles added."
            );
        }

        return 0;
    }
}
