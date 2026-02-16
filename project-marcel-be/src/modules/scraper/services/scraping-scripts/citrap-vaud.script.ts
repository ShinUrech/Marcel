/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "citrap-vaud.ch/" SCRAPPING SCRIPT
export async function getAllCitrapArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.citrap-vaud.ch/?page_id=4487`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;
  const PAGES_COUNT = 2;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('#content > article.post')).map((article) => {
        const dateElement = article.querySelector('.entry-meta time') as HTMLElement;
        const titleElement = article.querySelector('.entry-title a') as HTMLElement;
        const imageElement = article.querySelector('.entry-content img')?.getAttribute('src');
        const descriptionElement = article.querySelector('.entry-content p') as HTMLElement;

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: titleElement?.innerText?.trim() || 'N/A',
          url: titleElement?.getAttribute('href') || 'N/A',
          dateText: dateElement?.innerText.trim() || 'N/A',
          image: imageElement,
          teaser: descriptionElement?.innerText.trim() || 'N/A',
        };
      });
    }, ArticleType.News);
    articles.push(...teaserArticles);
    const nextPageButton = await page.$('.nav-previous a');

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

export async function getCitrapArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#content > article')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
