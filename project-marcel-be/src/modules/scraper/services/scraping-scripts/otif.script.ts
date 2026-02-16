/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';
//**/ NOTE: "otif.org/" SCRAPPING SCRIPT
export async function getAllOtifArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const pageUrl = `https://otif.org/de/?page_id=218`;

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  console.log(`Scraping: ${pageUrl}`);

  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.jet-listing-grid__items > .jet-listing-grid__item')).map(
      (article) => {
        const dateElement = article.querySelector(
          '.jet-listing-dynamic-field .jet-listing-dynamic-field__content',
        ) as HTMLElement;
        const titleElement = article.querySelector('.elementor-heading-title') as HTMLElement;
        const url = (article.querySelector('div[data-url]') as HTMLElement).getAttribute('data-url');
        const imageElement = article.querySelector('.jet-listing-dynamic-image__img')?.getAttribute('src');
        const descriptionElement = article.querySelector('.jet-listing-dynamic-field p') as HTMLElement;

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: titleElement?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          dateText: dateElement?.innerText.trim() || 'N/A',
          image: imageElement,
          teaser: descriptionElement?.innerText.trim() || 'N/A',
        };
      },
    );
  }, ArticleType.News);

  await browser.close();
  return teaserArticles;
}

export async function getOtifArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-element_type="container"]')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
