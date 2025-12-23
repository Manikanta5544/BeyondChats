# BeyondChats – AI Worker (Article Enhancement Service)

## Overview

The AI Worker is a standalone Node.js service responsible for enhancing articles stored in the Laravel backend. It fetches an article, searches for relevant external references, scrapes supporting content, enhances the original article using an LLM, and publishes the enhanced version back to the Laravel API.

This service is intentionally designed as an independent worker to demonstrate clean separation of concerns, production-grade error handling, and realistic AI integration under real-world constraints such as rate limits, partial failures, and fallback strategies.

---

## Responsibilities

The AI Worker performs the following tasks:

- Fetch an article from the Laravel API
- Search Google for related external articles using SerpAPI
- Scrape content from selected reference URLs
- Enhance the original article using an LLM (OpenAI)
- Append citations and references
- Update the article back in the Laravel database

---

## Architecture
```
┌───────────────┐        HTTP        ┌────────────────┐
│   Laravel API │◄─────────────────►│   AI Worker    │
│   (Articles)  │                    │  (Node.js)     │
└───────────────┘                    └────────────────┘
                                           │
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     │                                           │
              ┌───────────────┐                          ┌───────────────┐
              │   SerpAPI     │                          │   OpenAI LLM  │
              │(Google Search)│                          │ (Enhancement) │
              └───────────────┘                          └───────────────┘
```

---

## Tech Stack

- **Node.js** (ES Modules)
- **Express** – HTTP API
- **Axios** – HTTP client
- **Cheerio** – HTML scraping
- **SerpAPI** – Google search results
- **OpenAI API** – Content enhancement
- **dotenv** – Environment configuration

---

## Project Structure
```bash
ai-worker/
├── src/
│ ├── index.js # Express server entry point
│ ├── config.js # Centralized configuration
│ ├── utils/
│ │ └── logger.js # Structured logging
│ └── services/
│ ├── articleService.js # Laravel API integration
│ ├── searchService.js # Google search via SerpAPI
│ ├── scrapeService.js # Reference content scraping
│ ├── llmService.js # OpenAI / mock enhancement
│ └── enhanceService.js # Orchestration logic
├── .env.example
├── package.json
└── README.md
```

---

## Environment Variables

Create a `.env` file using `.env.example`:

```bash
PORT=3001
LARAVEL_API_URL=http://localhost:8000/api

OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o

SERPAPI_KEY=your_serpapi_key

# Optional fallback mode if OpenAI quota is exhausted
LLM_MODE=mock
```
**Notes**
LLM_MODE=mock enables deterministic mock enhancement output when OpenAI quota is unavailable

Mock mode is explicitly logged and used only as a fallback to keep the pipeline functional for evaluation and demos

## Installation & Run
```bash
cd ai-worker
npm install
cp .env.example .env
npm start
```
### On successful start:

```yaml
INFO: Laravel API: http://localhost:8000/api
INFO: BeyondChats AI Worker running on port 3001
API Endpoints
Health Check
http
Copy code
GET /health
```
### Response:

```yaml
{
  "status": "healthy",
  "service": "beyondchats-ai-worker"
}
```
### Enhance a Specific Article
POST /enhance/:id
**Example**:
```curl
curl -X POST http://localhost:3001/enhance/1
```
**Response**:

```json
{
  "success": true,
  "message": "Article enhanced successfully",
  "article_id": 1,
  "references_used": 2,
  "reference_urls": [
    "https://www.ibm.com/think/insights/...",
    "https://www.socialintents.com/blog/..."
  ]
}
```
**Enhance Latest Article**
```bash
POST /enhance-latest
```
This endpoint automatically fetches the most recent article using:

```bash
GET /api/articles/latest
```
## Enhancement Flow (Step-by-Step)
Fetch – Retrieve article from Laravel API
Search – Query Google via SerpAPI using article title
Filter – Remove self-domain and non-article URLs
Scrape – Extract readable content using multiple fallback selectors
Enhance – Use OpenAI to improve clarity, structure, and depth
Fallback to mock output if OpenAI quota is exceeded
Publish – Save enhanced content, references, status, and timestamps

## Error Handling & Resilience
Partial failures in scraping do not break the pipeline

    Clear differentiation between:
    Invalid article
    No references found
    Scraping failures
    LLM quota or rate limits
    Deterministic mock fallback ensures demo reliability

All critical steps are logged for traceability

## Design Decisions & Trade-offs
- Single-pass enhancement (no agent chains) to stay within time constraints
- HTTP-only communication (no queues or background workers)
- Enhanced content is updated in the same article record (no duplication)
- Explicit logging for reviewer visibility
- No authentication layer (intentionally omitted)

## Known Limitations
- Enhancement quality depends on available OpenAI quota
- Reference scraping limited to static HTML pages
- No background scheduling or retry queues
- No authentication or authorization layer

## Testing
**End-to-End Test Flow**
```bash

# 1. Ensure Laravel backend is running
cd ../backend
php artisan serve

# 2. Verify Laravel has articles
curl http://localhost:8000/api/articles

# 3. Start AI Worker
cd ../ai-worker
npm start

# 4. Test health endpoint
curl http://localhost:3001/health

# 5. Enhance an article
curl -X POST http://localhost:3001/enhance/1

# 6. Verify enhancement in Laravel
curl http://localhost:8000/api/articles/1
```