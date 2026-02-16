/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "pro-bahn.ch/" SCRAPPING SCRIPT
export async function getAllProBahnArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.pro-bahn.ch/schweiz/aktuell/aktuelle-meldungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(
        document.querySelectorAll('#mesch-filter-list-b285 > div.mesch-filter-list-result > div.news-item'),
      ).map((article) => {
        const url = article.querySelector('a')?.getAttribute('href');
        const title = article.querySelector('h3') as HTMLElement;
        const description = article.querySelector('p:nth-of-type(2)') as HTMLElement;
        const date = article.querySelector('.news-date') as HTMLElement;

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    // Trouver la page active
    const nextPageLink = await page.evaluateHandle(() => {
      const activePage = document.querySelector('div.ccm-pagination-wrapper > ul > li.next > a');
      return activePage ? activePage : null;
    });

    if (pageCount >= PAGES_COUNT) {
      break;
    }
    try {
      if (!nextPageLink) {
        console.log('No more pages.');
        break;
      }

      console.log('Clicking on next page...');
      await nextPageLink.click();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}

export async function getProBahnArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#content')).map((article: HTMLElement) => {
      return article.textContent;
    });
  });

  await browser.close();
  return originalArticle.join();
}
