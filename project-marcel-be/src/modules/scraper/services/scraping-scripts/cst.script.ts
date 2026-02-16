/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "cst.ch/news/" SCRAPPING SCRIPT
export async function getAllCstlArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.cst.ch/news/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('article.et_pb_post')).map((article) => {
      const url = article.querySelector('.entry-title a')?.getAttribute('href');
      const title = article.querySelector('.entry-title a') as HTMLElement;
      const description = article.querySelector('.post-content-inner p') as HTMLElement;
      const date = article.querySelector('.post-meta .published') as HTMLElement;
      const imageElement = article.querySelector('.et_pb_image_container img');

      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || 'N/A',
        url: url ? `${url}` : 'N/A',
        dateText: date?.textContent.trim() || 'N/A',
        teaser: description.innerText.trim() || 'N/A',
        image: image ? `${image}` : 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

export async function getCstlArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        'article > div.entry-content > div > div > div.et_pb_section  div.et_pb_column_2.et-last-child',
      ),
    ).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
