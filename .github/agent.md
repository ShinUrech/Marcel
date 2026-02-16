# Agent Instructions

You are working on **Marcel**, a Swiss rail news aggregation platform for IRISO Bau AG.

## Project Overview

- **Monorepo** with two sub-projects and Docker orchestration at the root
- `project-marcel-be/` — NestJS 10 backend (TypeScript)
- `project-marcel-fe/` — Next.js 16 frontend (TypeScript, React 19, Tailwind CSS)
- `docker-compose.yml` — Full stack: MongoDB 7, backend, frontend, scraper-cron
- `mongo-init/seed.js` — MongoDB seed data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 10, Mongoose, Puppeteer, OpenAI GPT-4o-mini, Sharp, Winston |
| Frontend | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 3, dayjs (German locale) |
| Database | MongoDB 7 (single `articles` collection) |
| Scraping | 35+ Puppeteer scripts for Swiss rail sources |
| Containerization | Docker Compose with 4 services |

## Key Conventions

### Backend (`project-marcel-be/`)

- **Module structure**: `src/modules/{name}/controllers/`, `services/`, organized by NestJS module pattern
- **Scraper pattern**: Each source has a dedicated method in `scraper.service.ts` or individual files under `src/modules/scraper/services/scrapper-scripts/`
- **Article schema** (Mongoose): `baseUrl`, `url`, `title`, `dateText`, `date`, `teaser`, `generatedTeaser`, `image`, `imageLocal`, `googleImage`, `type` (News | Video | LinkedIn), `originalContent`, `generatedContent`, `metadata`
- **Environment**: Uses `envalid` for validation. Config in `src/common/configs/environment.ts`
- **Linting**: ESLint + Prettier enforced via lint-staged on commit

### Frontend (`project-marcel-fe/`)

- **App Router** (Next.js): Pages in `app/`, components in `components/`
- **Translations**: `locales/en.json` — despite `.json` name, content is in German
- **CSS variables**: `--primaryBlue: #134074`, `--primaryOrange: #E8611A` defined in `app/globals.css`
- **Date formatting**: dayjs with German locale (`de`), format `DD.MM.YYYY`
- **Environment**: `lib/env.ts` uses `envalid`. Public vars prefixed `NEXT_PUBLIC_`

### General

- All code is **TypeScript**
- Dates stored as ISO in MongoDB, displayed as `DD.MM.YYYY` (Swiss/German format)
- Article `type` enum: `"News"`, `"Video"`, `"LinkedIn"`
- Source URLs shown as non-clickable text (intentional UX decision)
- Compact display for certain sources: Bahnblogstelle, Baublatt, SOB LinkedIn

## Important Files

| File | Purpose |
|------|---------|
| `project-marcel-be/src/modules/scraper/services/scraper.service.ts` | Main scraper orchestrator (32 rail sources) |
| `project-marcel-be/src/modules/scraper/controllers/scraper.controller.ts` | Scraper API endpoints |
| `project-marcel-be/src/models/articles.models.ts` | Mongoose Article schema |
| `project-marcel-fe/app/page.tsx` | Homepage (News feed with compact sections) |
| `project-marcel-fe/components/` | All UI components (cards, header, footer, etc.) |
| `project-marcel-fe/locales/en.json` | German translations/labels |
| `docker-compose.yml` | Full stack Docker orchestration |

## Do NOT

- Add music video sources or generic YouTube catch-all routes
- Make source URLs clickable (they are intentionally plain text)
- Change the branding colors without explicit request
- Modify `.env.development` or `.env.local` with real credentials in commits
- Use `&&` to chain commands in PowerShell (use `;` instead)
