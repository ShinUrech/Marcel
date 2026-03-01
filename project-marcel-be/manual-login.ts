import * as dotenv from 'dotenv';
dotenv.config();

import puppeteer from 'puppeteer';
import * as path from 'path';

/**
 * Script used to manually log in to LinkedIn.
 * This will create a persistent session in puppeteer_data/linkedin
 * that the backend scraper can use.
 */
async function manualLogin() {
  const userDataDir = process.env.LINKEDIN_USER_DATA_DIR || path.resolve(process.cwd(), 'puppeteer_data', 'linkedin');
  console.log('Starting manual login browser...');
  console.log(`Using user data dir: ${userDataDir}`);

  // Create a custom instance directly here so we don't need compilation 
  // dependencies for a standalone script, but make it map to the same directory
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
    await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
    console.log('Opened LinkedIn login page.');

    if (process.env.LINKEDIN_EMAIL && process.env.LINKEDIN_PASSWORD) {
        console.log('Auto-filling credentials...');
        try {
            await page.waitForSelector('#username', { timeout: 5000 });
            await page.type('#username', process.env.LINKEDIN_EMAIL);
            await page.type('#password', process.env.LINKEDIN_PASSWORD);
            console.log('Credentials filled. Please wait to click login or login manually.');
        } catch(e) {
             console.log('Could not find login fields, you may already be logged in.');
        }
    }

    console.log('\n======================================================');
    console.log('ACTION REQUIRED:');
    console.log('1. Log in manually if you are not already logged in.');
    console.log('2. Solve any CAPTCHAs or security checks.');
    console.log('3. Wait until you see the LinkedIn news feed.');
    console.log('4. Close the browser window to save the session.');
    console.log('======================================================\n');

    // Wait for the user to close the browser
    return new Promise((resolve) => {
      browser.on('disconnected', () => {
        console.log('Browser closed. Session saved to ' + userDataDir);
        resolve(null);
      });
    });
  } catch (error) {
    console.error('Error during manual login:', error);
    await browser.close();
  }
}

manualLogin();
