# Claude Code Instructions

You are working on **Marcel**, a Swiss rail news aggregation platform for IRISO Bau AG.

## Context

This is a monorepo containing:
- `project-marcel-be/` — NestJS 10 backend with Puppeteer web scrapers and OpenAI content generation
- `project-marcel-fe/` — Next.js 16 frontend with Tailwind CSS and German locale
- `docker-compose.yml` — Production Docker stack (MongoDB, backend, frontend, scraper-cron)

## Architecture

- **Database**: MongoDB 7 with a single `articles` collection. Schema fields: `baseUrl`, `url`, `title`, `dateText`, `date`, `teaser`, `generatedTeaser`, `image`, `imageLocal`, `type` (News/Video/LinkedIn), `originalContent`, `generatedContent`, `metadata`.
- **Scrapers**: 35+ Puppeteer-based scrapers in `project-marcel-be/src/modules/scraper/services/scrapper-scripts/`. Orchestrated by `scraper.service.ts` with a `scrapeAllRailSources()` method covering 32 rail sources.
- **Content Generation**: OpenAI GPT-4o-mini rewrites scraped content via `content-generator` module.
- **Frontend**: Next.js App Router. German UI. Colors: `--primaryBlue: #134074`, `--primaryOrange: #E8611A`.

## Coding Style

- TypeScript everywhere (strict mode in frontend)
- Backend follows NestJS module pattern: `modules/{name}/controllers/`, `services/`
- Frontend uses functional React components with hooks
- Dates: stored as ISO Date in MongoDB, displayed as `DD.MM.YYYY` using dayjs with 'de' locale
- Environment validation via `envalid` in both projects
- ESLint + Prettier in backend (enforced by lint-staged)

## Key Decisions (do not change without asking)

1. **No music videos** — YouTube scrapers are rail-only, accessed via `/youtube/:channelName` routes
2. **Source URLs are non-clickable** — displayed as plain text, not links (intentional)
3. **Compact display** for Bahnblogstelle, Baublatt, SOB sources on homepage
4. **Branding**: IRISO Bau AG dark blue (#134074) and orange (#E8611A)
5. **Translations**: `locales/en.json` contains German text (naming is legacy)

## Common Tasks

### Adding a new scraper source
1. Create scraper function in `scrapper-scripts/` or add to `scraper.service.ts`
2. Add it to the `scrapeAllRailSources()` method in `scraper.service.ts`
3. If it needs a dedicated endpoint, add a `@Get` route in `scraper.controller.ts`

### Adding a new frontend page
1. Create directory under `app/` with `page.tsx`
2. Add navigation label to `locales/en.json`
3. Add link to `AppHeader.tsx` navigation

### Modifying article display
- News cards: `NewsCardItem.tsx`, compact: `NewsCardItemCompact.tsx`
- Video cards: `VideoCardItem.tsx`
- LinkedIn cards: `LinkedInPostItem.tsx`
- Article detail: `ArticleCard.tsx`
- Video detail: `VideoCard.tsx`

## Environment

- Host OS: Windows
- Shell: PowerShell (use `;` not `&&` to chain commands)
- Node.js 22, npm
- MongoDB runs locally on port 27017 or via Docker
