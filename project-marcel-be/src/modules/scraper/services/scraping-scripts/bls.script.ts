/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
export async function getAllBlsArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bls.ch/de/unternehmen/medien/medienmitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.mod_newslistitem')).map((article) => {
      const url = article.querySelector('.title')?.getAttribute('href');
      const title = article.querySelector('.title') as HTMLElement;
      const date = article.querySelector('.date') as HTMLElement;

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || 'N/A',
        url: url ? `https://www.bls.ch${url}` : 'N/A',
        dateText: date?.innerText.trim() || 'N/A',
        teaser: 'N/A',
        image: 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

//**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
export async function getAllBlsAdArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bls.ch/de/unternehmen/medien/ad-hoc-mitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.mod_newslistitem')).map((article) => {
      const url = article.querySelector('.title')?.getAttribute('href');
      const title = article.querySelector('.title') as HTMLElement;
      const date = article.querySelector('.date') as HTMLElement;

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || 'N/A',
        url: url ? `https://www.bls.ch${url}` : 'N/A',
        dateText: date?.innerText.trim() || 'N/A',
        teaser: 'N/A',
        image: 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

export async function getBlsArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#main > div.mod_paper.paper-high.container .paper-items')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
