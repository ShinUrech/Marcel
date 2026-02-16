/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "bahnberufe.de/" SCRAPPING SCRIPT
export async function getAllBahnberufeArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bahnberufe.de/bahn-news/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 5;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('li[id^="post-"]')).map((article) => {
        const url = article.querySelector('a')?.getAttribute('href');
        const title = article.querySelector('a') as HTMLElement;
        const description = article.querySelector('.wp-block-latest-posts__post-excerpt p') as HTMLElement;
        const date = article.querySelector('time') as HTMLElement;
        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);
    const nextPageButton = await page.$('a.next.page-numbers');

    if (nextPageButton) {
      const nextPageUrl = await page.evaluate((el) => el.href, nextPageButton);
      console.log(`Navigating to: ${nextPageUrl}`);
      await page.goto(nextPageUrl, { waitUntil: 'load', timeout: 0 });
      pageCount++;
      if (pageCount === PAGES_COUNT) {
        break;
      }
    } else {
      console.log('No more pages. Scraping complete.');
      break;
    }
  }

  await browser.close();
  return articles;
}

//**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
export async function getBahnberufeArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#page-wrapper > div.container-fluid')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
