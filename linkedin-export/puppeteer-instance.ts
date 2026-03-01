/* eslint-disable prettier/prettier */
import puppeteer from 'puppeteer';

export const getPuppeteerInstance = async (cookie = [], options: { userDataDir?: string } = {}) => {
  // Determine if we should run headless (default to true in production or if explicitly set)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isProduction = process.env.NODE_ENV === 'production';
  // Force headless to true if not explicitly set to false, especially on server environments
  const useHeadless = process.env.HEADLESS !== 'false';

  const browser = await puppeteer.launch({
    headless: useHeadless ? true : false, // true now defaults to the new headless mode in recent Puppeteer versions
    userDataDir: options.userDataDir,
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Helps in resource-constrained environments (Docker/Server)
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();

  // Set viewport to a realistic desktop size to avoid mobile layouts or detection
  await page.setViewport({ width: 1920, height: 1080 });

  if (cookie.length) {
    await page.setCookie(...cookie);
  }

  // Set a standard User Agent to reduce bot detection in headless mode
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );

  return { browser, page };
};
