/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "c-vanoli.ch/" SCRAPPING SCRIPT
export async function getAllCVanoliArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `http://www.c-vanoli.ch/ueber-uns/aktuelles`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.referenz-item')).map((article) => {
        const url = article.querySelector('.card__link')?.getAttribute('href');
        const title = article.querySelector('.card__content-inner h5') as HTMLElement;
        const subtitle = article.querySelector('.card__content-inner h3') as HTMLElement;

        const imageElement = article.querySelector('.card__image img');
        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: `${title?.innerText?.trim()} - ${subtitle?.innerText?.trim()}` || 'N/A',
          url: url ? `${url}` : 'N/A',
          dateText: 'N/A',
          teaser: 'N/A',
          image: image ? `${image}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://www.c-vanoli.ch/ueber-uns/aktuelles/page/${index + 1}/`;
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

export async function getCVanoliArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body section.section-news-single div.section-text')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
