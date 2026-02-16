/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "bahnblogstelle.com/" SCRAPPING SCRIPT
export async function getAllBahnBlogArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://bahnblogstelle.com/?s=schweiz`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('#main div.post.type-post')).map((article) => {
        const url = article.querySelector('.entry-title a')?.getAttribute('href');
        const title = article.querySelector('.entry-title a') as HTMLElement;
        const description = article.querySelector('.entry-content p') as HTMLElement;
        const date = article.querySelector('.entry-meta .date a') as HTMLElement;

        const imageElement = article.querySelector('.post-img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description?.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    const nextButton = await page.evaluate(() => {
      const activePage = document.querySelector('#main > nav .next.page-numbers')?.getAttribute('href');
      return activePage ? activePage : null;
    });

    if (pageCount >= PAGES_COUNT) {
      break;
    }

    if (!nextButton) {
      console.log('No more pages. Exiting...');
      break;
    }

    try {
      const nextPageUrl = `${nextButton}`;
      await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}

export async function getBahnBlogArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#main > div.post.type-post')).map((article: HTMLElement) => {
      return article.textContent;
    });
  });

  await browser.close();
  return originalArticle.join();
}
