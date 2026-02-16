/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "sbbcargo.com/" SCRAPPING SCRIPT
//! NOTE : COMPLETED
export async function getAllSbbCargoArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.sbbcargo.com/de/medien/social-media.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const PAGES_COUNT = 3;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.mod_socialitem')).map((article) => {
        const url = article?.querySelector('.mod_socialitem_link')?.getAttribute('href');
        const title = article.querySelector('.mod_socialitem_publisher') as HTMLElement;
        const description = article.querySelector('.mod_socialitem_text') as HTMLElement;
        const date = article.querySelector('.mod_socialitem_date') as HTMLElement;

        const imageElement = article.querySelector('.mod_image_inner_wrapper > img');
        const image = imageElement ? imageElement.getAttribute('data-src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url ? `${url}` : 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          originalContent: description.innerText?.trim() || 'N/A',
          image: image ? `${image}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    const string_Selector =
      '#main > div > div.layout_center > div > div.mod_socialstream_btn_load_more.var_center > button';
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
