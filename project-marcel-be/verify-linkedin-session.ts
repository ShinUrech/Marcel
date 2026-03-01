import * as dotenv from 'dotenv';
dotenv.config();

import puppeteer from 'puppeteer';
import * as path from 'path';

async function verifySession() {
  const userDataDir = process.env.LINKEDIN_USER_DATA_DIR || path.resolve(process.cwd(), 'puppeteer_data', 'linkedin');
  console.log(`Checking LinkedIn session at: ${userDataDir}`);

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir,
    args: [
      '--window-size=1920,1080',
      '--password-store=basic',
      '--use-mock-keychain',
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );

  try {
    console.log('Navigating to LinkedIn feed...');
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    
    // Check if we are redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('checkpoint')) {
      console.log('🔴 SESSION INVALID: Redirected to login or verification page.');
      console.log('Current URL: ', currentUrl);
      console.log('Please run "npx ts-node manual-login.ts" to create a new session.');
    } else {
      console.log('🟢 SESSION VALID: Reached LinkedIn feed.');
      console.log('Current URL: ', currentUrl);
    }
  } catch (error) {
    console.error('Error verifying session:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

verifySession();
