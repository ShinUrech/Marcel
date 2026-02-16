/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "alstom.com/" SCRAPPING SCRIPT
export async function getAllAlstomArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.alstom.com/media/press-releases-and-news`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  let pageCount = 1;

  const PAGES_COUNT = 3;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(
        document.querySelectorAll('.cards__item.cards__item--full > .cards__item.cards__item--full'),
      ).map((article) => {
        const url = article.querySelector('.cards__content')?.getAttribute('href');
        const title = article.querySelector('.cards__title span') as HTMLElement;
        const date = article.querySelector('.cards__timestamp') as HTMLElement;
        const imageElement = article.querySelector('.cards__media');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `https://www.alstom.com/${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: 'N/A',
          image: image ? `https://www.alstom.com/${image}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://www.alstom.com/media/press-releases-and-news?page=${index}`;
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

export async function getAlstomArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#block-alstom-contenudelapageprincipale > div.content section')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
