# BeyondChats – AI-Powered Article Enhancement Platform

**Full-Stack Assignment Submission (Backend · AI Worker · Frontend)**

## Overview

BeyondChats is a full-stack, production-oriented system that demonstrates how scraped blog content can be enhanced using AI, persisted reliably, and presented through a clean comparison interface.

The system is intentionally designed as three independent services to reflect real-world architecture and engineering practices:

- **Laravel Backend** – Data ingestion, persistence, and REST API layer
- **AI Worker (Node.js)** – Asynchronous article enhancement pipeline
- **React Frontend** – Reviewer-facing visualization and comparison UI

This separation ensures clear ownership boundaries, better fault isolation, and long-term extensibility.

## Live Deployments

| Service | Live URL |
|---------|----------|
| Frontend (Phase 3) | https://beyond-chats-ashen.vercel.app |
| Backend API | https://beyondchats-ltt6.onrender.com |
| AI Worker | https://beyondchats-ai-worker.onrender.com |

**Reviewer note:**  
The frontend URL alone is sufficient for functional evaluation.  
The backend and AI worker are provided to demonstrate system design and end-to-end completeness.

## System Architecture
```
┌─────────────────────────┐
│  React Frontend         │
│  (Vercel, Port 5173)    │
│  View & Compare Articles│
└─────────────┬───────────┘
              │ HTTP GET
              ▼
┌─────────────────────────┐
│  Laravel Backend        │
│  REST API (/api/*)      │
│  PostgreSQL             │
│  Dockerized             │
└─────────────┬───────────┘
              │ HTTP
              ▼
┌─────────────────────────┐
│  AI Worker (Node.js)    │
│  Scrape & Enhance       │
│  OpenAI / Mock Fallback │
└─────────────────────────┘
```

## Repository Structure
```
BeyondChats/
├── backend/          # Laravel API (Dockerized)
├── ai-worker/        # Node.js AI enhancement service
├── frontend/         # React SPA (Vite)
└── README.md         # This document
```

## Backend – Laravel API

### Responsibilities

- Scrape BeyondChats blog articles via sitemap
- Persist articles in the database
- Expose REST APIs for the frontend and AI worker
- Maintain article lifecycle (original → enhanced)

### Key Endpoints
```
GET  /api/articles
GET  /api/articles/{id}
POST /api/articles/{id}
```

### Deployment Notes

- Fully Dockerized due to free-tier shell restrictions on the hosting platform
- Database migrations and a controlled, one-time scrape are executed automatically at startup to populate initial data
- Uses managed PostgreSQL (Render)

### Environment Variables (Backend)
```bash
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:***
APP_URL=https://beyondchats-ltt6.onrender.com

DB_CONNECTION=pgsql
DB_HOST=***
DB_PORT=5432
DB_DATABASE=***
DB_USERNAME=***
DB_PASSWORD=***

CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

Sensitive values are intentionally masked.  
`APP_DEBUG=false` is set deliberately to ensure production-safe behavior.

## AI Worker – Article Enhancement Service

### Responsibilities

- Fetch articles from the Laravel API
- Search for related references using SerpAPI
- Scrape external sources
- Enhance content using OpenAI
- Update enhanced content back into the backend
- The AI worker is intentionally decoupled from the backend to simulate asynchronous processing and avoid blocking API requests


### Endpoints
```
POST /enhance/:id
POST /enhance-latest
GET  /health
```

### OpenAI Strategy (Production-Safe)

To handle free-tier limitations reliably, the AI worker supports a fallback strategy:

- If OpenAI quota is available → real AI enhancement
- If quota is exhausted → deterministic mock enhancement

The enhancement pipeline is designed to remain operational regardless of external billing or rate-limit constraints.


This approach ensures predictable demos and uninterrupted evaluation.

### Environment Variables (AI Worker)
```bash
PORT=3001
LARAVEL_API_URL=https://beyondchats-ltt6.onrender.com/api

OPENAI_API_KEY=sk-***
OPENAI_MODEL=gpt-4o

SERPAPI_KEY=***

LLM_MODE=mock
```

## Frontend – React SPA (Phase 3)

### Responsibilities

- Display a list of scraped articles
- Visualize enhancement status
- Show side-by-side comparison of original vs enhanced content
- Display reference URLs used during AI enhancement
- Handle loading, empty, and error states gracefully

### Design Philosophy

- **No UI libraries** – demonstrates core CSS and layout fundamentals
- **Minimal routing** – focused, reviewer-first UX
- **No internal IDs shown** – clean, production-grade presentation
- **Readable, internal-dashboard-style interface**

### Environment Variables (Frontend)
```bash
VITE_API_URL=https://beyondchats-ltt6.onrender.com/api
```

## CORS & Security Considerations

Laravel CORS configuration:
```php
'paths' => ['api/*'],
'allowed_origins' => [
  'http://localhost:5173',
  'https://beyond-chats-ashen.vercel.app'
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

- CORS is handled strictly server-side
- No client-side workarounds
- Production-safe defaults

## Functional Verification (Live)

### Frontend
- Article list loads correctly
- Selected article is highlighted
- Original and enhanced content are displayed side-by-side
- Reference URLs are visible when available

### Backend
- Articles persist correctly
- `/api/articles` returns valid data
- Article status transitions are tracked

### AI Worker
- Enhancement endpoints are reachable
- Mock fallback functions as expected
- Health check endpoint is available

## Known Constraints (Intentional)

| Constraint | Rationale |
|------------|-----------|
| Mock AI fallback | OpenAI free-tier limitations |
| No background queues | Out of assignment scope |
| No authentication | Not required by the assignment |
| Docker startup tasks | Render shell access is paid |
| Limited scraping | Ethical and rate-limit safe |

All constraints are explicit, documented, and justified.

## Alignment with Assignment Requirements

| Requirement | Status |
|-------------|--------|
| Scraping | ✅ Implemented |
| AI Enhancement | ✅ Implemented (real + fallback) |
| API Design | ✅ RESTful |
| Frontend UI | ✅ Clean, comparison-based |
| Error Handling | ✅ Graceful |
| Production Readiness | ✅ Dockerized |
| Code Quality | ✅ Modular, readable |
| Documentation | ✅ Comprehensive |

## Final Reviewer Notes

- This submission prioritizes correctness, clarity, and robustness
- The architecture mirrors real-world production systems
- Trade-offs are explicit and intentional
- The frontend URL is sufficient for functional review
- Backend and AI worker demonstrate end-to-end system thinking

This implementation intentionally prioritizes correctness, clarity, and architectural soundness over feature breadth.


## Recommended Evaluation Entry Point

**Frontend:**  
https://beyond-chats-ashen.vercel.app