/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "cargorail.ch/" SCRAPPING SCRIPT
export async function getAllCarGorailArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://cargorail.ch/blog/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('article.et_pb_post')).map((article) => {
        const url = article.querySelector('.entry-title a')?.getAttribute('href');
        const title = article.querySelector('.entry-title a') as HTMLElement;
        const description = article.querySelector('.anreisser') as HTMLElement;
        const date = article.querySelector('.published') as HTMLElement;
        const imageElement = article.querySelector('.entry-featured-image-url img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: `${url}` || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: `${image}` || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://cargorail.ch/blog/page/${index + 1}/`;
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

export async function getCarGorailArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('article > div.entry-content > div.et-l.et-l--post div.et_pb_text_inner'),
    ).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
