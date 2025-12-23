import axios from 'axios';
import { load } from 'cheerio';
import {
  MAX_CONTENT_LENGTH,
  MIN_CONTENT_LENGTH,
  SCRAPE_RETRY_COUNT
} from '../config.js';

const SELECTORS = [
  'article',
  'main',
  '.post-content',
  '.entry-content',
  '[role="main"]'
];

async function scrapeOnce(url) {
  const { data: html } = await axios.get(url, { timeout: 15000 });
  const $ = load(html);

  for (const selector of SELECTORS) {
    const text = $(selector).text().replace(/\s+/g, ' ').trim();
    if (text.length >= MIN_CONTENT_LENGTH) {
      return text.slice(0, MAX_CONTENT_LENGTH);
    }
  }

  throw new Error('Insufficient content');
}

export async function scrapeContent(url) {
  console.log('[DEBUG] Attempting to scrape URL:', url);
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL');
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }

  let attempt = 0;

  while (attempt <= SCRAPE_RETRY_COUNT) {
    try {
      return await scrapeOnce(parsed.href);
    } catch (err) {
      if (attempt === SCRAPE_RETRY_COUNT) {
        throw err;
      }
      attempt++;
    }
  }
}

