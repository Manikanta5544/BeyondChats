# BeyondChats – System Architecture

## High-Level System Architecture
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

The system is composed of three independently deployable services, each with a clearly defined responsibility.  
This mirrors real-world production architectures where ingestion, processing, and presentation are decoupled.

## Architectural Principles

The system is designed around the following principles:

- **Separation of Concerns** – Each service owns a single responsibility
- **Fault Isolation** – AI failures never impact frontend availability
- **Production Safety** – No runtime dependency on paid services
- **Explicit Trade-offs** – Constraints are intentional and documented
- **Reviewer-first Design** – Easy to understand and verify behavior

## Frontend Architecture (React SPA)

### Role

The frontend is a read-only visualization layer designed for reviewers and internal users.

### Responsibilities

- Fetch articles from the backend API
- Display article list and selection state
- Render original vs enhanced content side-by-side
- Display AI reference sources
- Handle loading, empty, and error states gracefully

### Key Design Decisions

- No UI frameworks (demonstrates CSS fundamentals)
- No routing libraries (single-screen workflow)
- No IDs shown in UI (clean, production-grade UX)
- Stateless components with centralized data hook

### Data Flow
```
User Action
   ↓
React Component
   ↓
GET /api/articles
GET /api/articles/{id}
   ↓
Render View
```

The frontend never mutates backend data directly.

## Backend Architecture (Laravel API)

### Role

The backend acts as the system of record and API provider.

### Responsibilities

- Scrape BeyondChats blog articles via sitemap
- Persist articles and metadata
- Expose REST APIs for frontend and AI worker
- Track article lifecycle (original → enhanced)

### Key Design Decisions

- REST-only API (no server-rendered views)
- Dockerized deployment for portability
- Startup-driven migrations and controlled scraping
- PostgreSQL for structured, relational storage

### Data Model (Simplified)
```
Article
- id
- title
- original_content
- enhanced_content
- status (original | enhanced)
- reference_urls[]
- scraped_at
- enhanced_at
```

### API Boundary

The backend does not perform AI processing.  
All enhancement logic is delegated to the AI worker.

## AI Worker Architecture (Node.js)

### Role

The AI worker is an asynchronous processing service responsible for enrichment.

### Responsibilities

- Fetch articles from the backend
- Search for relevant references (SerpAPI)
- Scrape external reference content
- Enhance article content using OpenAI
- Update enhanced content back to the backend

### Key Design Decisions

- Separate service to avoid blocking backend requests
- Explicit HTTP-based orchestration
- Graceful fallback when OpenAI quota is unavailable
- Deterministic behavior for evaluation reliability

### Enhancement Flow
```
POST /enhance/:id
   ↓
Fetch Article (Backend)
   ↓
Search References (SerpAPI)
   ↓
Scrape Content
   ↓
Enhance (OpenAI OR Mock)
   ↓
Update Article (Backend)
```

### OpenAI Fallback Strategy

If OpenAI is unavailable:

- Enhancement switches to mock mode
- Pipeline completes successfully
- System remains fully demonstrable

This ensures no evaluation failures due to billing limits.

## Deployment Architecture

Each service is deployed independently:

- **Frontend** → Vercel (static hosting)
- **Backend** → Render (Dockerized Laravel + PostgreSQL)
- **AI Worker** → Render (Node.js service)

Shell access is restricted on the free tier, so:

- Migrations and initial scraping are executed at container startup
- No background workers or queues are required

## Security & Boundaries

- CORS enforced at backend level
- No client-side workarounds
- Environment variables scoped per service
- No shared secrets between frontend and AI worker
- `APP_DEBUG` disabled in production

## Intentional Constraints

The following constraints are intentional:

- No authentication layer
- No background job queues
- Limited scraping volume
- Mock AI fallback

These trade-offs were chosen to prioritize:

- Reliability
- Reviewability
- Alignment with assignment scope

## Summary

This architecture demonstrates:

- Clear service boundaries
- Production-oriented thinking
- Explicit trade-offs
- Robust fallback strategies
- End-to-end system ownership

The system is designed to be easy to evaluate, safe to run, and straightforward to extend.