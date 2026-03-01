# LinkedIn Scraping with Persistent Sessions

## Overview
The LinkedIn scraper has been updated to use **persistent browser sessions** to bypass reCAPTCHA and other security checks. Instead of logging in every time (which triggers security challenges), the scraper reuses the cookies and local storage from a manual login session.

## Prerequisites
- **Puppeteer**: The scraper uses Puppeteer for browser automation.
- **Credentials**: Ensure `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD` are set in your `.env` file (though they are primarily used as a fallback or for the initial check).

## Setup & Usage

### 1. Manual Login (One-Time Setup)
To establish the persistent session, you need to log in manually once.

1. Run the manual login script:
   ```bash
   npx ts-node manual-login.ts
   ```
2. A Chrome window will open.
3. Log in to LinkedIn with your credentials.
4. **Solve any CAPTCHAs** or security challenges (e.g., "I'm not a robot", email verification).
5. Once you are successfully logged in and can see your LinkedIn feed, **close the browser window**.
6. The session data (cookies, local storage) is now saved in `puppeteer_data/linkedin`.

### 2. Running the Scraper
Now you can run the LinkedIn scraper as usual. It will automatically detect the saved session and use it.

```bash
npx ts-node run-linkedin.ts
```

### 3. Verifying the Session
If you suspect the session has expired (e.g., scraper starts failing or asking for login), you can verify the session status:

```bash
npx ts-node verify-linkedin-session.ts
```
*(Note: You need to create this script if it doesn't exist, see below)*

## Troubleshooting

### reCAPTCHA Issues
If the scraper gets stuck on reCAPTCHA:
1. Stop the scraper.
2. Run `npx ts-node manual-login.ts` again.
3. Log out and log back in manually to refresh the session tokens.
4. Close the browser and retry the scraper.

### "Session Expired"
LinkedIn sessions eventually expire. If this happens, simply repeat the **Manual Login** step.

## Directory Structure
- `puppeteer_data/linkedin`: Stores the user profile data (DO NOT COMMIT THIS FOLDER).
- `manual-login.ts`: Script to launch the browser for manual authentication.
- `src/modules/scraper/services/scraping-scripts/linkedIn.script.ts`: Main scraping logic.
