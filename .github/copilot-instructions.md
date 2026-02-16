# GitHub Copilot Instructions

## Project: Marcel — Swiss Rail News Aggregator

Monorepo for IRISO Bau AG containing a NestJS backend, Next.js frontend, and Docker orchestration.

## Structure

- `project-marcel-be/` — NestJS 10 backend (TypeScript, Mongoose, Puppeteer, OpenAI)
- `project-marcel-fe/` — Next.js 16 frontend (TypeScript, React 19, Tailwind CSS 3)
- `docker-compose.yml` — MongoDB 7 + backend + frontend + scraper-cron

## Code Style

- TypeScript only, no plain JavaScript
- Backend: NestJS decorators, dependency injection, module pattern
- Frontend: Functional React components, Next.js App Router, Tailwind utility classes
- Dates: dayjs with German locale ('de'), format DD.MM.YYYY
- Environment: envalid for validation in both projects

## Database Schema (MongoDB — `articles` collection)

```typescript
{
  baseUrl: string;        // Source website base URL
  url: string;            // Full article URL
  title: string;          // Article title
  dateText: string;       // Raw date string from source
  date: Date;             // Parsed ISO date
  teaser: string;         // Original teaser/summary
  generatedTeaser: string; // AI-generated teaser
  image: string;          // Original image URL
  imageLocal: string;     // Local downloaded image filename
  googleImage: string;    // Google reverse image search result
  type: 'News' | 'Video' | 'LinkedIn';
  originalContent: string; // Raw scraped HTML
  generatedContent: string; // AI-rewritten HTML
  metadata: object;       // Type-specific data (duration, views, source, icon)
}
```

## Naming Conventions

- Backend services: `PascalCase` (e.g., `ScraperService`, `ArticlesService`)
- Backend files: `kebab-case.ts` (e.g., `scraper.service.ts`, `articles.controller.ts`)
- Frontend components: `PascalCase.tsx` (e.g., `NewsCardItem.tsx`, `AppHeader.tsx`)
- CSS variables: `--primaryBlue`, `--primaryOrange` in globals.css
- API routes: RESTful, prefixed with `/api` (e.g., `/api/articles`, `/api/scraper/scrape-all`)

## Important Context

- YouTube scraping uses explicit `/youtube/:channelName` routes (no generic catch-all)
- Source URLs displayed as non-clickable text in UI
- `locales/en.json` contains GERMAN text (legacy naming)
- Colors: dark blue `#134074`, orange `#E8611A`
- Frontend `NEXT_PUBLIC_` vars are baked at build time in Docker
- Backend uses Puppeteer with system Chromium in Docker (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`)

## When generating code

- Prefer `async/await` over `.then()` chains
- Use NestJS decorators (`@Get`, `@Post`, `@Param`, `@Injectable`, etc.)
- Use Tailwind classes, avoid inline styles
- Handle errors with try/catch in scrapers (individual source failures should not stop the batch)
- Use dayjs for all date operations, never raw `Date` formatting
