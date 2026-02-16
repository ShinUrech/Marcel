/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "new.abb.com/" SCRAPPING SCRIPT
export async function getAllAbbArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://new.abb.com/railway/customer-stories`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('article.oneabb-newsbank-news-NewsItem')).map((article) => {
        const url = article.querySelector('.oneabb-newsbank-news-NewsLink')?.getAttribute('href');
        const title = article.querySelector('.oneabb-newsbank-news-NewsLink-text') as HTMLElement;
        const description = article.querySelector('.oneabb-newsbank-news-News-description') as HTMLElement;
        const date = article.querySelector('time[property="datePublished"]') as HTMLElement;
        const imageElement = article.querySelector('.oneabb-newsbank-news-thumbnail');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: `${url}` || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText?.trim() || 'N/A',
          image: `${image}` || 'N/A',
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

export async function getAbbArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#PublicWrapper > section.templateMainSection > main > article')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
