/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
export const getAllRoalpsArticles = async () => {
  const { browser, page } = await getPuppeteerInstance();

  const pageUrl = `https://proalps.ch/aktuell/?category=medienmitteilungen`;

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  let pageCount = 1;

  const PAGES_COUNT = 2;

  while (true) {
    const loadMoreButton = await page.$('.loadMoreButton');
    if (!loadMoreButton) break;

    pageCount++;
    if (pageCount === PAGES_COUNT) {
      break;
    }

    const isDisabled = await page.evaluate((button) => button.getAttribute('disabled') !== null, loadMoreButton);

    if (isDisabled) break;

    await loadMoreButton.click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('a.teaserColumns__item')).map((article) => ({
      baseUrl: window.location.href,
      type: articleType,
      title: (article.querySelector('h3.teaserColumns__title.font-h3') as HTMLElement)?.innerText.trim() || 'N/A',
      url: article.getAttribute('href') || '',
      teaser: (article.querySelector('.teaserColumns__text') as HTMLElement)?.innerText.trim() || 'N/A',
      dateText: (article.querySelector('.teaserColumns__date') as HTMLElement)?.innerText.trim() || 'N/A',
      image:
        (article.querySelector('.teaserColumns__titleWrapper') as HTMLElement)?.style.backgroundImage.replace(
          /url\(["']?(.*?)["']?\)/,
          '$1',
        ) ||
        null ||
        'N/A',
    }));
  }, ArticleType.News);

  await browser.close();
  return teaserArticles;
};

//**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
export async function getRoalpsArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#main > section .section__content')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
