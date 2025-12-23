// Init folder structure
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { enhanceArticle, enhanceLatestArticle } from './services/enhanceService.js';
import { log } from './utils/logger.js';

// console.log('[BOOT] LARAVEL_API_URL =', process.env.LARAVEL_API_URL);
// dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// console.log('DEBUG LARAVEL_API_URL =', process.env.LARAVEL_API_URL);

const requiredEnv = ['LARAVEL_API_URL', 'OPENAI_API_KEY', 'SERPAPI_KEY'];
const missing = requiredEnv.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}

log('INFO', `Laravel API: ${process.env.LARAVEL_API_URL}`);

const app = express();
app.use(express.json());

app.post('/enhance/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid article ID' });
  }
  try {
    const result = await enhanceArticle(id);
    res.json(result);
  } catch (err) {
    log('ERROR', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post('/enhance-latest', async (_req, res) => {
  try {
    const result = await enhanceLatestArticle();
    res.json(result);
  } catch (err) {
    log('ERROR', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      laravel: !!process.env.LARAVEL_API_URL,
      openai: !!process.env.OPENAI_API_KEY,
      serpapi: !!process.env.SERPAPI_KEY
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => log('INFO', `BeyondChats AI Worker running on port ${PORT}`));
