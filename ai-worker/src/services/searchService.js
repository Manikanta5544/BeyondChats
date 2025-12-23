import axios from 'axios';
import { MAX_REFERENCE_URLS, REQUEST_TIMEOUT } from '../config.js';
import { log } from '../utils/logger.js';

export async function searchRelatedArticles(query) {
  try {
    log('INFO', `Searching references for: "${query}"`);

    const { data } = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERPAPI_KEY,
        engine: 'google',
        num: 10
      },
      timeout: REQUEST_TIMEOUT
    });

    if (!Array.isArray(data?.organic_results)) {
      log('WARN', 'SerpAPI returned no organic results');
      return [];
    }

    const urls = [];

    for (const result of data.organic_results) {
      if (urls.length >= MAX_REFERENCE_URLS) break;

      const url = result?.link;
      if (!url || typeof url !== 'string') continue;

      try {
        new URL(url);

        const blockedDomains = [
          'beyondchats.com',
          'youtube.com',
          'facebook.com',
          'twitter.com',
          'linkedin.com',
          'instagram.com'
        ];

        if (blockedDomains.some(domain => url.includes(domain))) {
          continue;
        }

        urls.push(url);
        log('INFO', `Accepted reference URL: ${url}`);
      } catch {
        continue;
      }
    }

    log('INFO', `Selected ${urls.length} reference URLs`);
    return urls;

  } catch (err) {
    log('WARN', `Reference search failed: ${err.message}`);
    return [];
  }
}
