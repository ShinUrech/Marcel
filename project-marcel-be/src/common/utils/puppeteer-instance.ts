/* eslint-disable prettier/prettier */
import puppeteer from 'puppeteer';

const isProduction = process.env.NODE_ENV === 'production';

export const getPuppeteerInstance = async (cookie = [], options: { userDataDir?: string } = {}) => {
  const browser = await puppeteer.launch({
    headless: isProduction ? 'shell' : false,
    userDataDir: options.userDataDir,
    slowMo: isProduction ? 0 : 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--ignore-certificate-errors',
      '--window-size=1920,1080',
      ...(isProduction ? [] : ['--password-store=basic', '--use-mock-keychain']),
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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
