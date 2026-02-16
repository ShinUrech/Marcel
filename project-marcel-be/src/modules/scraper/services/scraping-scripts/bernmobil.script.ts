/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "bernmobil.ch/" SCRAPPING SCRIPT
export async function getAllBernmobilArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bernmobil.ch/de/medien/medienmitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.view-content.row > .col-xs-12.col-md-4')).map((article) => {
        const url = article.querySelector('a.content-teaser__link')?.getAttribute('href');
        const title = article.querySelector('h3.content-teaser__title') as HTMLElement;
        const image = article.querySelector('img')?.getAttribute('src') || '';
        const description = article.querySelector('.content-teaser__text') as HTMLElement;
        const date = article.querySelector('time') as HTMLElement;
        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.bernmobil.ch${url}` || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          image: `https://www.bernmobil.ch${image}`,
          teaser: description.innerText.trim() || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);
    const nextPageButton = await page.$('li.pager__item--next > a');

    if (nextPageButton) {
      const nextPageUrl = await page.evaluate((el) => el.href, nextPageButton);
      console.log(`Navigating to: ${nextPageUrl}`);
      await page.goto(nextPageUrl, { waitUntil: 'load', timeout: 0 });
      pageCount++;
    } else {
      console.log('No more pages. Scraping complete.');
      break;
    }
  }

  await browser.close();
  return articles;
}

//**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
export async function getBernmobilArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#content > section > article')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
