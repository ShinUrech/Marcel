/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "stadt-zuerich.ch/" SCRAPPING SCRIPT
export async function getAllStadtArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.stadt-zuerich.ch/vbz/de/die-vbz/medien/medienmitteilungen.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const PAGES_COUNT = 2;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.stzh-search__results-item')).map((article) => {
        const url = article.querySelector('.stzh-card-searchresult__heading-link')?.getAttribute('href');
        const title = article.querySelector('.stzh-card-searchresult__heading-link div[slot="heading"]') as HTMLElement;
        const description = article.querySelector(
          '.stzh-card-searchresult__description div[slot="description"]',
        ) as HTMLElement;
        const date = article.querySelector('.stzh-card-searchresult__dateline') as HTMLElement;

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `https://www.stadt-zuerich.ch${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description.innerText.trim() || 'N/A',
          image: 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    const string_Selector =
      '#teaser > form > div.stzh-search__results-wrapper > div.stzh-search__actions-wrapper > stzh-button > button';

    const loadMoreButton = await page.$(string_Selector);
    if (!loadMoreButton) break;

    const isDisabled = await page.evaluate((button) => button.getAttribute('disabled') !== null, loadMoreButton);

    if (isDisabled) break;

    await loadMoreButton.click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  await browser.close();
  return articles;
}

export async function getStadtArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('#content > div > stzh-pagecontent > div > div > stzh-section stzh-content'),
    ).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
