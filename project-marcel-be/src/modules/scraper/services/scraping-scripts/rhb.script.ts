/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
export async function getAllRhbProjectArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.rhb.ch/en/company/projects-dossiers`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.mod_overview_teaser')).map((article) => {
      const url = article?.querySelector('a').getAttribute('href');
      const title = article.querySelector('.article__title') as HTMLElement;
      const titleSub = article.querySelector('.subtitle') as HTMLElement;
      const description = article.querySelector('.content p:not(.target)') as HTMLElement;

      const imageElement = article.querySelector('.visual_img');
      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || titleSub?.innerText?.trim() || 'N/A',
        url: url ? `https://www.rhb.ch${url}` : 'N/A',
        dateText: 'N/A',
        teaser: description?.innerText.trim() || 'N/A',
        image: image ? `${image}` : 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

//**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
export async function getAllRhbNewsArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.rhb.ch/en/news-events/bauarbeiten`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.mod_overview_teaser')).map((article) => {
      const url = article?.querySelector('a').getAttribute('href');
      const title = article.querySelector('.article__title') as HTMLElement;
      const titleSub = article.querySelector('.subtitle') as HTMLElement;
      const description = article.querySelector('.content p:not(.target)') as HTMLElement;

      const imageElement = article.querySelector('.visual_img');
      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || titleSub?.innerText?.trim() || 'N/A',
        url: url ? `https://www.rhb.ch${url}` : 'N/A',
        dateText: 'N/A',
        teaser: description?.innerText.trim() || 'N/A',
        image: image ? `${image}` : 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

export async function getRhbProjectArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section > div.panel_content div.mod_content_text p.bodytext')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
