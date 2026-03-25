# GitHub Copilot Instructions

## Project: Marcel — Swiss Rail News Aggregator

Monorepo for IRISO Bau AG containing a NestJS backend, Next.js frontend, and Docker orchestration.

## Structure

- `project-marcel-be/` — NestJS 10 backend (TypeScript, Mongoose, Puppeteer, OpenAI)
- `project-marcel-fe/` — Next.js 16 frontend (TypeScript, React 19, Tailwind CSS 3)
- `docker-compose.prod.yml` — Production: DigitalOcean droplet (backend + cron only, no frontend/mongo)
- `docker-compose.yml` — Local dev: MongoDB 7 + backend + frontend + scraper-cron

## Deployment

- **Backend**: DigitalOcean droplet at `167.71.60.209:5000`, running Docker
- **Frontend**: Vercel at `marcel-one.vercel.app` (auto-deploys from `ShinUrech/Marcel` → `project-marcel-fe/`)
- **Database**: MongoDB Atlas (`cluster0.zzrf7u0.mongodb.net/practicedb`)
- **Images**: Stored in Docker named volume `backend-public`, served via `GET /api/articles/show/:fileName`

## Proxy Architecture (HTTPS/HTTP bridge)

Vercel (HTTPS) cannot call the DigitalOcean backend (HTTP) directly — mixed content is blocked.
A Next.js proxy route bridges them:

- `project-marcel-fe/app/api/backend/[...path]/route.ts` — forwards all `/api/backend/*` to `BACKEND_URL`
- `NEXT_PUBLIC_SERVER_URL=/api/backend/api` — used by browser (goes through proxy)
- `BACKEND_URL=http://167.71.60.209:5000` — used by SSR server components directly
- `NEXT_PUBLIC_SERVER_FILE_HOST` — deprecated/unused, images now use `NEXT_PUBLIC_SERVER_URL`

**Image URL pattern**: `${NEXT_PUBLIC_SERVER_URL}/articles/show/${filename}` — all image components use this.

## Code Style

- TypeScript only, no plain JavaScript
- Backend: NestJS decorators, dependency injection, module pattern
- Frontend: Functional React components, Next.js App Router, Tailwind utility classes
- Dates: dayjs with German locale ('de'), format DD.MM.YYYY
- Environment: envalid for validation in both projects

## Database Schema (MongoDB — `articles` collection)

```typescript
{
  baseUrl: string;               // Source website base URL
  url: string;                   // Full article URL (unique)
  title: string;                 // Article title
  imageTitleContext: string;     // AI-generated search query for Google image search
  dateText: string;              // Raw date string from source
  date: Date;                    // Parsed ISO date
  teaser: string;                // Original teaser/summary
  generatedTeaser: string;       // AI-generated teaser
  image: string;                 // Original image URL from source
  imageLocal: string;            // Local filename (stored in /app/public/, served via /api/articles/show/)
  googleImage: string;           // Filename from Google image search (same path convention as imageLocal)
  type: 'News' | 'Video' | 'LinkedIn';
  originalContent: string;       // Raw scraped HTML
  generatedContent: string;      // AI-rewritten HTML
  metadata?: {                   // Type-specific data
    duration: string;            // Video duration
    views: string;               // Video view count
    uploadDate: string;          // Video upload date
    source: string;              // Post source
    icon: string;                // LinkedIn company icon URL
  };
}
```

## API Endpoints

### Scraper (`/api/scraper/`)
- `GET /scrape-all` — Scrape all 30+ news + 8 YouTube sources (runs in cron daily 03:00 UTC)
- `GET /download` — Download images for articles that have `image` url but no `imageLocal`
- `GET /linkedin/:company` — Scrape LinkedIn company posts — **LOCAL ONLY**, never add to server cron
- `GET /youtube/:channelName` — Scrape a YouTube channel
- `GET /youtube/:channelName/:term` — Search a YouTube channel
- `GET /formateDates` — Reformat raw date strings

### Content Generator (`/api/content-generator/`)
- `GET /content` — AI-rewrite article HTML (uses CHATGPT_API_KEY)
- `GET /teaser` — AI-generate teasers
- `GET /video` — AI-generate YouTube video summaries
- `GET /image-title` — AI-generate image search queries (`imageTitleContext` field)
- `GET /better-images` — Run Google image search + download for articles missing images

### Articles (`/api/articles/`)
- `GET /` — Paginated news articles
- `GET /videos` — Paginated video articles
- `GET /linkedin` — Paginated LinkedIn articles
- `GET /nrandom` — Random news article
- `GET /vrandom` — Random video article
- `GET /search` — Search articles
- `GET /:id` — Single article by ID
- `GET /show/:fileName` — Serve image file from `/app/public/`

## Scraper Sources

**News (32):** Roalps, SEV Online, Bernmobil, Bahnberufe, Lok Report, RailMarket, Baublatt, ProBahn, Presseportal, Bahnblogstelle, Hupac, Doppelmayr, Aargau Verkehr, RBS, CST, CarGoRail, Zentralbahn, Stadt Zürich, ZVV, Alstom, ABB, Rhomberg Sersa, BLS, BLS Ad, SBB Cargo, Müller Frauenfeld, C-Vanoli, Presseportal EM, RhB Projects, RhB News, SOB, Citrap

**YouTube (8):** SBBCFFFFS, blsag, raborig, zaborig, SuedostbahnSOB, StadlerRail, SiemensMobility, AlstomOfficial

**LinkedIn (2, local-only):** `sbb`, `bls-ag` — trigger manually from local machine only (see LinkedIn section below)

## LinkedIn Scraping — Local Machine Only

LinkedIn scraping **must run on the developer's local machine**. It cannot run on the DigitalOcean server and must never be added to the automated cron.

### Why it cannot run on the server

LinkedIn binds session cookies (`li_at`) to the originating IP address. Copying a cookie from a browser and using it from a different machine/IP always results in:
```
❌ LINKEDIN_LI_AT cookie is invalid for this server IP.
```
This has been confirmed repeatedly — there is no workaround. The credential login path also fails on the server because LinkedIn triggers a security checkpoint when it detects a new IP or headless browser.

### How it works locally

The scraper uses Puppeteer with a **persistent `userDataDir`** (`project-marcel-be/puppeteer_data/linkedin/`). This stores the full browser session (cookies, local storage) on disk.

- **First run / expired session**: Puppeteer opens a visible Chromium window. The developer logs in manually. The session is saved to `userDataDir` and reused on future runs.
- **Session still valid**: Puppeteer uses the stored session silently — no login needed.
- **`LINKEDIN_LI_AT` env var**: If set, the scraper tries to inject this cookie instead of using `userDataDir`. This only works when the cookie was obtained on the same machine/IP. Leave it empty locally and rely on `userDataDir` instead.

### How to run LinkedIn scraping locally

1. Make sure the backend is running locally (`docker compose up` or `npm run start:dev`)
2. Ensure `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD` are set in your local `.env`
3. Trigger the endpoints:
   ```
   GET http://localhost:5000/api/scraper/linkedin/sbb
   GET http://localhost:5000/api/scraper/linkedin/bls-ag
   ```
4. If the session has expired, a Chromium window will open — log in manually, then the scraper continues automatically.
5. The session persists in `project-marcel-be/puppeteer_data/linkedin/` for future runs.

### What NEVER to do

- **Never** add LinkedIn endpoints to the server cron (`docker-compose.prod.yml`)
- **Never** try to run LinkedIn scraping via SSH/remote trigger on the DigitalOcean server
- **Never** copy a `li_at` cookie from your browser and try to use it on the server — it will always fail



1. `scraper/scrape-all` — scrape all news + YouTube
2. `scraper/download` — download source images
3. `content-generator/content` — AI rewrite content
4. `content-generator/teaser` — AI generate teasers
5. `content-generator/image-title` — generate image search terms
6. `content-generator/better-images` — fetch + download Google images

## Frontend Pages & Components

**Pages** (`project-marcel-fe/app/`):
- `/` — Homepage (news + videos sidebar)
- `/article/[id]` — News article detail
- `/video/[id]` — Video detail with YouTube embed
- `/linkedin/[id]` — LinkedIn post detail
- `/search` — Search results
- `/contact` — Contact form

**SSR pages** use `BACKEND_URL` directly (skip proxy). Client components use `NEXT_PUBLIC_SERVER_URL`.

**Components** (`project-marcel-fe/components/`):
`AppHeader`, `AppFooter`, `ArticleCard`, `NewsCardItem`, `NewsCardItemSm`, `NewsCardItemCompact`, `VideoCard`, `VideoCardItem`, `LinkedInCard`, `LinkedInPostItem`, `RandomArticles`, `ReadNext`, `WatchNext`, `SearchBar`, `Pagination`, `Loading`, `WarningMsg`, `ContactForm`, `YouTubeEmbed`, `YoutubePlayer`, `Duration`, `FramedImage`, `AdvertisementSection`

## Naming Conventions

- Backend services: `PascalCase` (e.g., `ScraperService`, `ArticlesService`)
- Backend files: `kebab-case.ts` (e.g., `scraper.service.ts`, `articles.controller.ts`)
- Frontend components: `PascalCase.tsx` (e.g., `NewsCardItem.tsx`, `AppHeader.tsx`)
- CSS variables: `--primaryBlue`, `--primaryOrange` in globals.css
- API routes: RESTful, prefixed with `/api`

## Environment Variables

**Backend (required):**
- `NODE_ENV`, `PORT`, `APP_NAME`
- `MONGO_URI` — MongoDB Atlas connection string
- `CHATGPT_API_KEY` — OpenAI API key
- `LINKEDIN_EMAIL`, `LINKEDIN_PASSWORD`, `LINKEDIN_LI_AT` — optional, local scraping only
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` — set in Docker

**Frontend (required):**
- `NEXT_PUBLIC_SERVER_URL=/api/backend/api` — API base URL (goes through proxy in production)
- `BACKEND_URL=http://167.71.60.209:5000` — direct URL for SSR only (not `NEXT_PUBLIC_`)
- `GMAIL_USER`, `GMAIL_APP_PASS` — contact form SMTP
- `APP_NAME`, `APP_EMAIL`
- `TWITTER_LINK`, `FACEBOOK_LINK`, `INSTAGRAM_LINK`, `YOUTUBE_LINK`, `TELEGRAM_LINK` — optional

## Important Context

- YouTube scraping uses explicit `/youtube/:channelName` routes (no generic catch-all)
- LinkedIn scraping is **local-only** — requires Puppeteer + auth session, never run on server automatically
- Source URLs displayed as non-clickable text in UI
- `locales/en.json` contains GERMAN text (legacy naming)
- Colors: dark blue `#134074`, orange `#E8611A`
- Frontend `NEXT_PUBLIC_` vars are baked at build time in Docker/Vercel
- `imageLocal` and `googleImage` store **plain filenames only** (e.g. `image-1234.jpg`), not paths
- Image files are served at `GET /api/articles/show/:filename` from the Docker named volume

## When generating code

- Prefer `async/await` over `.then()` chains
- Use NestJS decorators (`@Get`, `@Post`, `@Param`, `@Injectable`, etc.)
- Use Tailwind classes, avoid inline styles
- Handle errors with try/catch in scrapers (individual source failures should not stop the batch)
- Use dayjs for all date operations, never raw `Date` formatting
