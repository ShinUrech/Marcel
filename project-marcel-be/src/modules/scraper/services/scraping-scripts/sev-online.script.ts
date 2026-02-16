/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "sev-online.ch/" SCRAPPING SCRIPT
export const getAllSevOnlineArticles = async () => {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://sev-online.ch/de/medien/medienmitteilung`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  // Extract the last page number from the pagination links
  const totalPages = await page.evaluate(() => {
    const lastPageLink = document.querySelector('.MarkupPagerNavLastNum a');
    return lastPageLink ? parseInt(lastPageLink.getAttribute('href').match(/page(\d+)$/)?.[1] || '1') : 1;
  });

  console.log(`Total pages found: ${totalPages}`);
  const PAGES_COUNT = 1;
  const allArticles = [];

  // Loop through each page
  for (let pageNumber = 1; pageNumber <= PAGES_COUNT; pageNumber++) {
    const pageUrl = pageNumber === 1 ? baseUrl : `${baseUrl}/page${pageNumber}`;
    console.log(`Scraping: ${pageUrl}`);

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.widget-content > article.cf')).map((article) => {
        const titleElement = article.querySelector('article a') as HTMLElement;
        const url = titleElement?.getAttribute('href');
        const dateElement = article.querySelector('article .date') as HTMLElement;
        const descriptionElement = article.querySelector('article p').childNodes[5] as HTMLElement; // The text node containing the description

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: titleElement?.innerText?.trim() || 'N/A',
          url: url ? `https://sev-online.ch${url}` : 'N/A',
          dateText: dateElement?.innerText.trim() || 'N/A',
          teaser: descriptionElement?.textContent?.trim() || 'N/A',
        };
      });
    }, ArticleType.News);
    allArticles.push(...teaserArticles);
  }

  await browser.close();
  return allArticles;
};

export async function getSevOnlineArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('body > div.wrapper > div > div > div.main-content > div.content.block.cf > article'),
    ).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
