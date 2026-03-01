import { getPuppeteerInstance } from './src/common/utils/puppeteer-instance';
import * as path from 'path';
import * as fs from 'fs';

async function verifySession() {
  const userDataDir = path.join(process.cwd(), 'puppeteer_data', 'linkedin');

  if (!fs.existsSync(userDataDir)) {
    console.error('❌ No session data found. Please run `npx ts-node manual-login.ts` first.');
    process.exit(1);
  }

  console.log('Checking LinkedIn session validity...');

  // We can run headless for verification
  const { browser, page } = await getPuppeteerInstance([], { userDataDir });

  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('linkedin.com/feed');

    if (isLoggedIn) {
      console.log('✅ Session is VALID. You are logged in.');
    } else {
      console.warn('⚠️  Session appears INVALID or EXPIRED.');
      console.warn('   Current URL:', currentUrl);
      console.warn('   Please run `npx ts-node manual-login.ts` to refresh your session.');
    }
  } catch (error) {
    console.error('❌ Error checking session:', error);
  } finally {
    await browser.close();
  }
}

verifySession();
