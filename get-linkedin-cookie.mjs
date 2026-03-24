/**
 * Run with: node get-linkedin-cookie.mjs
 * Opens a visible Chrome window to linkedin.com/login
 * After you log in, press ENTER in this terminal and it prints li_at
 */
import puppeteer from 'puppeteer';
import readline from 'readline';
import { writeFileSync } from 'fs';

const CHROME = '/home/shin/.cache/puppeteer/chrome/linux-133.0.6943.53/chrome-linux64/chrome';
const PROFILE = '/tmp/li-cookie-profile';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  userDataDir: PROFILE,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--password-store=basic',
    '--no-first-run',
  ],
});

const page = await browser.newPage();
await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });

console.log('\n✅ Chrome opened — please log into LinkedIn in the browser window.');
console.log('   Press ENTER here once you are on the LinkedIn feed.\n');

const rl = readline.createInterface({ input: process.stdin });
await new Promise(resolve => rl.once('line', resolve));
rl.close();

const cookies = await page.cookies('https://www.linkedin.com');
const liAt = cookies.find(c => c.name === 'li_at');

if (liAt) {
  console.log('\n✅ li_at =', liAt.value);
  writeFileSync('/tmp/li_at.txt', liAt.value);
  console.log('   Saved to /tmp/li_at.txt');
} else {
  console.log('\n❌ li_at cookie not found — are you fully logged in?');
}

await browser.close();
