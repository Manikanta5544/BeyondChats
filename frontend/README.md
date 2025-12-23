# BeyondChats – Frontend (Phase 3)

## Overview
The BeyondChats Frontend is a React-based single-page application (SPA) designed to visualize scraped and AI-enhanced articles from the Laravel backend. It allows reviewers to clearly compare original vs AI-enhanced content, inspect enhancement status, and view external references used during AI processing.
This frontend acts as a validation and inspection layer for the AI enhancement pipeline, allowing reviewers to verify correctness, references, and content transformations.

This frontend intentionally focuses on clarity, correctness, and maintainability rather than visual overengineering, aligning with real-world internal dashboards and reviewer expectations.

## Responsibilities

The frontend is responsible for:
- Fetching articles from the Laravel API
- Displaying a list of all scraped articles
- Showing original and enhanced content
- Rendering side-by-side comparisons for enhanced articles
- Displaying reference URLs used by the AI Worker
- Handling loading, empty, and error states gracefully

## Architecture
```
┌──────────────────┐
│  React Frontend  │
│  (Vite + React)  │
│  Port: 5173      │
└────────┬─────────┘
         │ HTTP (GET)
         ▼
┌──────────────────┐
│  Laravel API     │
│  Articles API    │
│  Port: 8000      │
└──────────────────┘
```

The frontend is read-only by design, consuming backend data without mutating state directly.

## Tech Stack

- **React 18** – Component-based UI
- **Vite** – Fast dev server and build tool
- **Vanilla CSS** – Custom layout and styling (no UI frameworks)
- **Fetch API** – Backend communication
- **ES Modules** – Modern JavaScript standard

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── articles.js          # Laravel API client
│   ├── components/
│   │   ├── ArticleList.jsx      # Sidebar list of articles
│   │   ├── ArticleDetail.jsx    # Original article view
│   │   ├── CompareView.jsx      # Original vs Enhanced comparison
│   │   └── Loader.jsx           # Loading indicator
│   ├── hooks/
│   │   └── useArticles.js       # Centralized data fetching hook
│   ├── pages/
│   │   └── Home.jsx             # Main layout and routing logic
│   ├── styles/
│   │   ├── base.css             # Global reset & typography
│   │   ├── layout.css           # Grid layout & responsiveness
│   │   └── article.css          # Article & comparison styles
│   ├── App.jsx                  # Root component
│   └── main.jsx                 # Application entry point
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## Environment Configuration

Create a `.env` file from the example:
```bash
cp .env.example .env
```

`.env` contents:
```bash
VITE_API_URL=http://localhost:8000/api
```

 **The frontend is environment-agnostic and can be deployed independently of the backend.**  
Change `VITE_API_URL` for staging or production.

## Installation & Running
```bash
cd frontend
npm install
npm run dev
```

By default, the app runs at:
```
http://localhost:5173
```

## Application Behavior

### Article List
- Displays all articles fetched from the backend
- Shows article title and current status
- Highlights the selected article

**Status values:**
- `original` – Not yet enhanced
- `enhanced` – Processed by AI Worker

### Article View Logic
- **Original article** → shows original content only
- **Enhanced article** → shows side-by-side comparison:
  - Original content
  - Enhanced content
  - Displays reference URLs if available

## API Integration

### Endpoints Used
```
GET /api/articles
GET /api/articles/{id}
```

### Expected Response Shape
```json
{
  "id": 1,
  "title": "Article Title",
  "original_content": "<p>...</p>",
  "enhanced_content": "<p>...</p>",
  "reference_urls": ["https://example.com"],
  "status": "enhanced",
  "enhanced_at": "2025-12-23T08:24:47Z"
}
```

**The frontend is resilient to**:
- Missing enhanced content
- Missing references
- Empty article lists

### CORS Requirements

Ensure Laravel allows frontend access:

**`config/cors.php`**
```php
'paths' => ['api/*'],
'allowed_origins' => [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
],
```

⚠️ Restart Laravel after updating CORS.

## UX & Design Decisions

- **No UI libraries** – Demonstrates CSS fundamentals
- **No routing libraries** – Single-page flow is sufficient
- **No IDs shown in UI** – Cleaner, production-grade UX
- **Explicit empty states** – Avoids confusing blank screens
- **Side-by-side comparison** – Clear value demonstration
- **Minimal animation** – Focus on content, not distraction

## Known Limitations

- Read-only interface (no editing)
- No authentication or roles
- No pagination (all articles loaded)
- Assumes HTML content is safe (trusted backend)

These are intentional trade-offs for assignment scope.

## Testing Checklist
```bash
# Backend running
curl http://localhost:8000/api/articles

# Frontend running
npm run dev
```