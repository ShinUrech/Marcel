/* eslint-disable prettier/prettier */
import puppeteer from 'puppeteer';

const isProduction = process.env.NODE_ENV === 'production';

export const getPuppeteerInstance = async (cookie = []) => {
  const browser = await puppeteer.launch({
    headless: isProduction ? true : false,
    slowMo: isProduction ? 0 : 50,
    args: isProduction
      ? [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ]
      : [],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });
  if (cookie.length) {
    browser.setCookie(...cookie);
  }
  const page = await browser.newPage();
  return { browser, page };
};
