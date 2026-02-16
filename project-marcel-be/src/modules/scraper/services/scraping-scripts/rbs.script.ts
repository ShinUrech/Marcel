/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "rbs.ch/" SCRAPPING SCRIPT
export async function getAllRbslArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.rbs.ch/medienmitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('#block-rbs-content .view-content .views-row')).map((article) => {
        const url = article.querySelector('.field-name-node-title h2 a')?.getAttribute('href');
        const title = article.querySelector('.field-name-node-title h2 a') as HTMLElement;
        const description = article.querySelector('.field--name-body p') as HTMLElement;
        const date = article.querySelector('.field-name-field-pr-date time') as HTMLElement;
        const imageElement = article.querySelector('.field-name-field-pr-images img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `https://www.rbs.ch/${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: image ? `https://www.rbs.ch/${image}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://www.rbs.ch/medienmitteilungen?page=${index + 1}`;
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

export async function getRbslArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#main-page-container > main > div > div.layout-content')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
