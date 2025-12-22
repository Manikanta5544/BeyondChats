# BeyondChats – Technical Product Manager Assignment

## Overview
This project implements a backend system to scrape, store, and manage blog articles from BeyondChats.  
The goal of this assignment is to demonstrate strong problem-solving skills, clean backend architecture, and production-ready decision making under time constraints.

### The system:
- Scrapes the oldest blog articles from BeyondChats
- Stores them in a PostgreSQL database
- Exposes full CRUD APIs using Laravel
- Can be safely re-run without duplicating data

The implementation prioritizes correctness, clarity, and maintainability over over-engineering.

---

## Architecture
┌─────────────────────────────┐
│ Artisan CLI Command │
│ scrape:blogs │
└─────────────┬───────────────┘
│
▼
┌─────────────────────────────┐
│ WordPress Post Sitemap │
│ post-sitemap.xml │
└─────────────┬───────────────┘
│
▼
┌─────────────────────────────┐
│ Laravel 11 Backend API │
│ - Scraper Command │
│ - Article Model │
│ - CRUD Controllers │
└─────────────┬───────────────┘
│
▼
┌─────────────────────────────┐
│ PostgreSQL Database │
│ articles table │
└─────────────────────────────┘

---

## Data Flow
1. `php artisan scrape:blogs` is executed  
2. The command fetches the BeyondChats post sitemap  
3. The oldest blog URLs are identified  
4. Each article page is fetched and parsed  
5. Articles are stored in PostgreSQL  
6. CRUD APIs expose the stored data  

---

## Tech Stack
- Backend Framework: Laravel 11  
- Language: PHP 8.2  
- Scraping: Symfony HttpClient, DomCrawler  
- Database: PostgreSQL  
- CLI: Laravel Artisan  

---

## Local Setup
### Prerequisites
- PHP 8.2+
- Composer
- PostgreSQL

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
php artisan scrape:blogs --limit=5   #Scraping oldest Blog Articles
```
## API endpoints
All endpoints are prefixed with /api.

GET -    /api/articles
GET -    /api/articles/{id}
POST-    /api/articles
PUT	-    /api/articles/{id}
DELETE - /api/articles/{id}
GET	-   /api/articles/latest

## Database Design

The system uses a single articles table to keep the data model simple and extensible.

Key fields:
- title
- original_url
- original_content
- enhanced_content
- scraped_at
- created_at

Duplicate articles are avoided by checking existing URLs before insertion.

## Key Engineering Decisions
### Sitemap-Based Scraping

The /blogs page on BeyondChats is client-side rendered and does not reliably expose a server-rendered “last page”.

To correctly fetch the oldest blog posts, the implementation uses the WordPress post sitemap, which:
- Contains all published blog articles
- Preserves chronological ordering
- Avoids the need for headless browsers
- Is reliable and production-safe

This ensures deterministic and repeatable scraping.

## Trade-offs and Assumptions

1. No Puppeteer or Playwright
2. No authentication or authorization
3. No background jobs or queues
4. Oldest articles inferred from sitemap ordering
5. Single-table database design for simplicity

All trade-offs were made consciously to optimize for clarity and correctness.

## Known Limitations

1. Relies on sitemap availability
2. HTML parsing assumes semantic markup
3. APIs do not support pagination or filtering
4. AI-based enhancement is not implemented in this phase
