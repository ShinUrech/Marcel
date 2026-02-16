/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "doppelmayr.com/" SCRAPPING SCRIPT
export async function getAllDoppelArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.doppelmayr.com/wissen-entdecken/news-termine/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 5;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('#dummy-id div.row.masonry-container.is-scrollable .item')).map(
      (article) => {
        const url = article.querySelector('a.link-holder-teaser')?.getAttribute('href');
        const title = article.querySelector('.headline.h5') as HTMLElement;
        const description = article.querySelector('.text') as HTMLElement;
        const imageElement = article.querySelector('.img-holder img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.doppelmayr.com${url}` || 'N/A',
          dateText: 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      },
    );
  }, ArticleType.News);

  articles.push(...teaserArticles);

  // Trouver la page active

  const nextPageLink = await page.evaluateHandle(() => {
    const activePage = document.querySelector('#dummy-id > div > div.row.load-more-row > div > button');
    return activePage ? activePage : null;
  });
  try {
    if (!nextPageLink) {
      console.log('No more pages.');
    }
    if (pageCount < PAGES_COUNT) {
      console.log('Clicking on next page...');
      await nextPageLink.click();

      await new Promise((resolve) => setTimeout(resolve, 1500));
      pageCount++;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {}

  await browser.close();
  return articles;
}

export async function getDoppelArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('#__layout > div > div > div > div.page-wrapper.gated-false > div.block-holder'),
    ).map((article: HTMLElement) => {
      return article.textContent;
    });
  });

  await browser.close();
  return originalArticle.join();
}
