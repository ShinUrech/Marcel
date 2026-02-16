/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "zvv.ch/" SCRAPPING SCRIPT
export async function getAllZvvArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.zvv.ch/de/ueber-uns/zuercher-verkehrsverbund/news.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.cmp-teaser')).map((article) => {
      const url = article.querySelector('.cmp-teaser__link')?.getAttribute('href');
      const title = article.querySelector('.cmp-teaser__title') as HTMLElement;
      const date = article.querySelector('.cmp-teaser__pretitle') as HTMLElement;

      const imageElement = article.querySelector('.cmp-image__image');

      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || 'N/A',
        url: url ? `https://www.zvv.ch${url}` : 'N/A',
        dateText: date?.innerText.trim() || 'N/A',
        teaser: 'N/A',
        image: image ? `https://www.zvv.ch${image}` : 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

export async function getZvvArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('main.container div.container div.cmp-wrapper:not(.infobox) > div.cmp-text'),
    ).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
