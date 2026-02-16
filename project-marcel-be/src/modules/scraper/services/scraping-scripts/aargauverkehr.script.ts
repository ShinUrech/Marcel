/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "aargauverkehr.ch/" SCRAPPING SCRIPT
export async function getAllAarglArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.aargauverkehr.ch/ava/medien/medienstelle/allemedienmitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(
        document.querySelectorAll('#eb div.eb-post-listing.is-column.eb-post-listing--col-2 .eb-post-listing__item'),
      ).map((article) => {
        const url = article.querySelector('.eb-post-title a')?.getAttribute('href');
        const title = article.querySelector('.eb-post-title') as HTMLElement;
        const description = article.querySelector('.eb-post-body p') as HTMLElement;
        const image =
          (article.querySelector('.o-aspect-ratio a') as HTMLElement)?.style.backgroundImage.match(
            /url\(["']?(.*?)["']?\)/,
          )?.[1] || '';
        const date = article.querySelector('.eb-post-date time') as HTMLElement;
        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `https://www.aargauverkehr.ch${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://www.aargauverkehr.ch/ava/medien/medienstelle/allemedienmitteilungen?start=${10 * (index + 1)}`;
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

export async function getAarglArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[data-eb-posts]')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
