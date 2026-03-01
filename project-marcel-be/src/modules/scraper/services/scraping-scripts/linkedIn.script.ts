/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';
import { isAllowedLinkedInCompany } from '../scraping-config/target-sources.config';
import { RecaptchaSolverService } from '../recaptcha-solver.service';
import * as path from 'path';
import { parseRelativeDateLinkedIn } from 'src/common/utils/format-date';

function getLinkedInCredentials() {
  const email = (process.env.LINKEDIN_EMAIL || '').trim();
  const password = (process.env.LINKEDIN_PASSWORD || '').trim();

  // Treat missing or placeholder values as "not configured"
  if (!email || email === 'TO REPLACE' || !password || password === 'TO REPLACE') {
    throw new Error(
      'LinkedIn credentials are not set. Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in your environment and restart the server.',
    );
  }

  return { email, password };
}

//**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT
export async function getAllLinkedInArticles(
  companyName: string,
  recaptchaSolver?: RecaptchaSolverService,
  fromDate?: Date,
) {
  // Validate if company is in approved list
  if (!isAllowedLinkedInCompany(companyName)) {
    console.warn(`⚠️  LinkedIn company '${companyName}' is not in the approved list. Skipping scraping.`);
    return [];
  }

  const { email, password } = getLinkedInCredentials();

  console.log(`✅ LinkedIn company '${companyName}' is approved. Starting scraping...`);

  // Use persistent user data directory to save session
  const userDataDir = path.resolve(process.cwd(), 'puppeteer_data', 'linkedin');
  console.log(`[LinkedIn] Using persistent userDataDir: ${userDataDir}`);

  const { browser, page } = await getPuppeteerInstance([], { userDataDir });

  try {
    // ── STEP 1: Inject li_at cookie (if provided) on the LinkedIn domain ──────
    // Cookies can only be reliably set after a navigation to the target domain.
    const liAtCookie = (process.env.LINKEDIN_LI_AT || '').trim();
    if (liAtCookie) {
      console.log(`[LinkedIn] Step 1/6: Injecting li_at cookie on LinkedIn domain...`);
      // Navigate to the root to establish the domain context
      await page.goto('https://www.linkedin.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.setCookie({
        name: 'li_at',
        value: liAtCookie,
        domain: '.linkedin.com',
        path: '/',
        httpOnly: true,
        secure: true,
      });
      console.log(`[LinkedIn] ✅ li_at cookie injected.`);
    } else {
      console.log(`[LinkedIn] Step 1/6: No LINKEDIN_LI_AT set, relying on userDataDir session.`);
    }

    // ── STEP 2: Verify we are actually logged in ───────────────────────────────
    console.log(`[LinkedIn] Step 2/6: Verifying session by navigating to feed...`);
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3000)); // Wait for any client-side redirects

    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('/feed') || currentUrl.includes('/dashboard') || currentUrl.includes('/home');
    console.log(`[LinkedIn] Current URL after feed nav: ${currentUrl} | loggedIn=${isLoggedIn}`);

    if (!isLoggedIn) {
      // ── STEP 3: Fall back to credential login ─────────────────────────────
      console.log(`[LinkedIn] Step 3/6: Session invalid. Attempting credential login...`);
      const loginUrl = 'https://www.linkedin.com/login';
      await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      const usernameEl = await page.$('#username');
      const passwordEl = await page.$('#password');

      console.log(`[LinkedIn] url=${page.url()} title=${await page.title()} loginForm=${Boolean(usernameEl && passwordEl)}`);

      if (usernameEl && passwordEl) {
        console.log(`[LinkedIn] Step 4/6: Submitting credentials...`);
        await usernameEl.type(email, { delay: 50 });
        await passwordEl.type(password, { delay: 50 });
        await page.click('button[type="submit"]');

        try {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (e: any) {
          console.log(`[LinkedIn] Login navigation wait ended or timed out: ${e?.message}`);
        }

        const postLoginUrl = page.url();
        console.log(`[LinkedIn] Post-login URL: ${postLoginUrl}`);

        if (postLoginUrl.includes('/checkpoint/') || postLoginUrl.includes('/authwall')) {
          console.warn(`[LinkedIn] Checkpoint detected after credential login — cannot proceed without manual verification.`);
          throw new Error('Blocked by LinkedIn checkpoint after login');
        }

        const afterLoginUrl = page.url();
        const loggedInAfterCreds = afterLoginUrl.includes('/feed') || afterLoginUrl.includes('/dashboard') || afterLoginUrl.includes('/home');
        if (!loggedInAfterCreds) {
          console.warn(`[LinkedIn] Credential login did not result in a feed page. URL: ${afterLoginUrl}`);
          throw new Error('Credential login failed — could not reach LinkedIn feed');
        }
        console.log(`[LinkedIn] ✅ Credential login successful.`);
      } else {
        console.warn(`[LinkedIn] Login form not found and not logged in. URL: ${page.url()} Title: ${await page.title()}`);
        throw new Error('Could not log in to LinkedIn: login form not detected and no valid session');
      }
    } else {
      console.log(`[LinkedIn] ✅ Session is valid.`);
    }

    // Navigate to posts page
    const targetUrl = `https://www.linkedin.com/company/${companyName}/posts/?feedView=all`;
    console.log(`[LinkedIn] Step 5/6: Navigating to target page: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000)); // Wait for feed to load

    // Scroll to load more posts
    // If latestArticleDate is null, we assume "Scrape All" and scroll more
    const scrollCount = 10;
    console.log(`[LinkedIn] Scrolling ${scrollCount} times...`);

    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(async () => {
        window.scrollBy(0, window.innerHeight * 2);
      });
      console.log(`[LinkedIn] Scroll ${i + 1}/${scrollCount}...`);
      await new Promise((r) => setTimeout(r, 3000));
    }

    console.log(`[LinkedIn] Step 6/6: Extracting articles...`);

    // DEBUG: log current URL and post count before extraction
    const finalUrl = page.url();
    const finalTitle = await page.title();
    const postCount = await page.evaluate(() => document.querySelectorAll('.feed-shared-update-v2').length);
    console.log(`[LinkedIn] Final URL: ${finalUrl} | Title: ${finalTitle} | .feed-shared-update-v2 count: ${postCount}`);

    // Pass latestArticleDate to the browser context
    const articles = await page.evaluate((articleType, companyName) => {
      const posts = Array.from(document.querySelectorAll('.feed-shared-update-v2'));
      const results = [];

      for (const post of posts) {
        // Extract date text (e.g., "2d", "1w", "3mo")
        // LinkedIn structure varies, usually in .update-components-actor__sub-description
        // or .feed-shared-actor__sub-description
        const dateEl =
          post.querySelector('.update-components-actor__sub-description span[aria-hidden="true"]') ||
          post.querySelector('.feed-shared-actor__sub-description span[aria-hidden="true"]') ||
          post.querySelector('.update-components-actor__sub-description > span'); // Fallback to old selector

        const dateText = dateEl ? (dateEl as HTMLElement).innerText.replace(/\•/g, '').replace(/\Modifié/g, '').trim() : 'N/A';

        const textElement =
          post.querySelector('.update-components-text span.break-words') ||
          post.querySelector('.feed-shared-update-v2__description .feed-shared-inline-show-more-text') ||
          post.querySelector('.feed-shared-update-v2__description'); // Fallback to old selector

        // Try to find the link in the date element first, as it's usually the permalink to the post
        const dateLinkEl =
          post.querySelector('.update-components-actor__sub-description a') ||
          post.querySelector('.feed-shared-actor__sub-description a');

        const articleUrlElement = post.querySelector('a.app-aware-link');
        const imageElement =
          post.querySelector('.update-components-image__image') || 
          post.querySelector('.feed-shared-image__image') ||
          post.querySelector('img.update-components-article__image');

        const companyImgElement = post.querySelector('img');

        let postUrl = window.location.href;
        if (dateLinkEl) {
          postUrl = (dateLinkEl as HTMLAnchorElement).href;
        } else if (articleUrlElement) {
          postUrl = (articleUrlElement as HTMLAnchorElement).href;
        }

        // Allow posts with either text or image
        if (textElement || imageElement) {
          const titleText = textElement ? (textElement as HTMLElement).innerText : 'No Title';
          const contentText = textElement ? (textElement as HTMLElement).innerHTML.trim() : 'N/A'; // Returning HTML to match old format

          results.push({
            baseUrl: window.location.href,
            type: articleType,
            title: titleText.slice(0, 50) + (titleText.length > 50 ? '...' : ''),
            url: postUrl,
            dateText: dateText,
            image: imageElement ? (imageElement as HTMLImageElement).getAttribute('src') : 'N/A', // Match old .src fallback
            originalContent: contentText,
            metadata: {
              icon: companyImgElement ? companyImgElement.getAttribute('src') : 'N/A',
              source: companyName,
            }
          });
        }
      }
      return results;
    }, ArticleType.LinkedIn, companyName);

    const newArticles = [];

    console.log(`[LinkedIn] Processing extracted articles...`);

    for (const article of articles) {
      const articleDate = parseRelativeDateLinkedIn(article.dateText);

      if (articleDate) {
        // @ts-ignore
        article.date = articleDate;
      } else {
        console.warn(
          `[LinkedIn] Could not parse date '${article.dateText}' for article: ${article.title}. Defaulting to now.`,
        );
        // @ts-ignore
        article.date = new Date();
      }

      // Filter by date if fromDate is provided
      if (fromDate) {
        // @ts-ignore
        if (article.date.getTime() < fromDate.getTime()) {
          console.log(
            // @ts-ignore
            `[LinkedIn] Skipping article from ${article.date.toISOString()} (older than ${fromDate.toISOString()})`,
          );
          continue;
        }
      }

      newArticles.push(article);
    }

    console.log(`[LinkedIn] Extracted ${articles.length} articles. Saving ${newArticles.length} of them.`);

    return newArticles;
  } catch (error: any) {
    console.error(`[LinkedIn] Error in scraping process: ${error.message}`);
    return [];
  } finally {
    await browser.close();
  }
}
