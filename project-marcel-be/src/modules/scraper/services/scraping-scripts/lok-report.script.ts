/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "lok-report.de/" SCRAPPING SCRIPT
export async function getAllLokReportArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.lok-report.de/component/k2/itemlist/category/41.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;
  const PAGES_COUNT = 2;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.itemContainer.itemContainerLast')).map((article) => {
        const url = article.querySelector('.catItemTitle a')?.getAttribute('href');
        const title = article.querySelector('.catItemTitle a') as HTMLElement;
        const description =
          (article.querySelector('.catItemIntroText p:nth-of-type(2)') as HTMLElement) ||
          (article.querySelector('.catItemIntroText p') as HTMLElement);
        const date = article.querySelector('.catItemDateCreated') as HTMLElement;
        const imageElement = article.querySelector('.catItemIntroText img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `https://www.lok-report.de${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: image ? `https://www.lok-report.de${image}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    const nextPageUrl = await page.evaluate(() => {
      const links: HTMLElement[] = Array.from(document.querySelectorAll('.art-pager a.hasTip'));
      const nextLink = links.find((link) => link.innerText.trim() === 'Weiter');
      return nextLink ? nextLink.getAttribute('href') : null;
    });

    if (nextPageUrl) {
      if (pageCount === PAGES_COUNT) {
        break;
      }
      await page.goto(`https://www.lok-report.de${nextPageUrl}`, { waitUntil: 'networkidle2' });
      pageCount++;
    } else {
      console.log('No more pages. Scraping complete.');
      break;
    }
  }

  await browser.close();
  return articles;
}

export async function getLokReportArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#k2Container')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
