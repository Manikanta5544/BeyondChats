import { getArticle, getLatestArticle, updateArticle } from './articleService.js';
import { searchRelatedArticles } from './searchService.js';
import { scrapeContent } from './scrapeService.js';
import { enhanceWithLLM } from './llmService.js';
import { log } from '../utils/logger.js';

function validateArticle(article) {
  if (!article?.id || !article?.title || !article?.original_content) {
    throw new Error('Invalid article data structure');
  }
}

export async function enhanceArticle(articleId) {
  log('INFO', `Starting enhancement for article ID: ${articleId}`);

  // Fetch article 
  const article = await getArticle(articleId);
  validateArticle(article);

  if (article.status === 'enhanced') {
    log('WARN', 'Article already enhanced');
    return {
      success: false,
      message: 'Article already enhanced',
      article_id: articleId
    };
  }

  // Search references
  const urls = await searchRelatedArticles(article.title);

  if (urls.length === 0) {
    log('WARN', 'No reference URLs found. Enhancing using original content only.');
  }

  // Scrape references
  const scrapeResults = await Promise.allSettled(urls.map(scrapeContent));

  const references = scrapeResults
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);

  if (references.length === 0) {
    log('WARN', 'No reference content scraped. Proceeding without references.');
  }

  const enhancedContent = await enhanceWithLLM(
    article.original_content,
    references,
    urls.slice(0, references.length)
  );

  // Persist
  await updateArticle(articleId, {
    enhanced_content: enhancedContent,
    reference_urls: urls,
    status: 'enhanced',
    enhanced_at: new Date().toISOString()
  });

  log('INFO', 'Article enhancement complete');

  return {
    success: true,
    message: 'Article enhanced successfully',
    article_id: articleId,
    references_used: references.length,
    reference_urls: urls
  };
}

export async function enhanceLatestArticle() {
  log('INFO', 'Fetching latest article for enhancement');
  const article = await getLatestArticle();
  return enhanceArticle(article.id);
}
