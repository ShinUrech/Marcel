/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "baublatt.ch/" SCRAPPING SCRIPT
export async function getAllBaublattArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.baublatt.ch/suche?fulltext=eisenbahn`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('#app > div.main-content > div article.article-item')).map(
        (article) => {
          const url = article.querySelector('a')?.getAttribute('href');
          const title = article.querySelector('a h2.article-title') as HTMLElement;
          const description = article.querySelector('.article-teaser-text a') as HTMLElement;
          const date = article.querySelector('.article-date') as HTMLElement;
          const imageElement = article.querySelector('.article-image');

          const image = imageElement ? imageElement.getAttribute('src') : '';

          return {
            baseUrl: window.location.href,
            type: articleType,
            title: title?.innerText?.trim() || 'N/A',
            url: url || 'N/A',
            dateText: date?.innerText.trim() || 'N/A',
            teaser: description.innerText.trim() || 'N/A',
            image: image || 'N/A',
          };
        },
      );
    }, ArticleType.News);

    articles.push(...teaserArticles);
    const nextPageUrl = await page.evaluate(() => {
      const nextPageElement = document.querySelector('.pagination .page-item a[rel="next"]') as HTMLElement;
      return nextPageElement ? nextPageElement.getAttribute('href') : null;
    });

    if (!nextPageUrl) break;

    if (pageCount >= PAGES_COUNT) {
      break;
    }

    pageCount++;
    await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
  }

  await browser.close();
  return articles;
}

export async function getBaublattArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#app article.article:not(.article-item)')).map(
      (article: HTMLElement) => {
        return article.textContent;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
