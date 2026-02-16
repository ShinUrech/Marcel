/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';
//**/ NOTE: "sob.ch/" SCRAPPING SCRIPT
export async function getAllSobArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://direkt.sob.ch/archiv`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('.archive-container > .article')).map((article) => {
      const url = article?.querySelector('.article-header a').getAttribute('href');
      const title = article.querySelector('.article-header__title h2 span') as HTMLElement;
      const titleSub = article.querySelector('.subtitle') as HTMLElement;
      const description = article.querySelector('.article-content__teaser p') as HTMLElement;
      const date = article.querySelector('.article-header__date time')?.getAttribute('datetime');
      const imageElement = article.querySelector('.article-image__wrap img');
      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        baseUrl: window.location.href,
        type: articleType,
        title: title?.innerText?.trim() || titleSub?.innerText?.trim() || 'N/A',
        url: url ? `https://direkt.sob.ch${url}` : 'N/A',
        dateText: date || 'N/A',
        teaser: description?.innerText.trim() || 'N/A',
        image: image ? `https://direkt.sob.ch${image}` : 'N/A',
      };
    });
  }, ArticleType.News);

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

export async function getSobArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.news.news-single div.article  div.col-12.col-md-6.col-lg-8')).map(
      (article: HTMLElement) => {
        return article.innerText;
      },
    );
  });

  await browser.close();
  return originalArticle.join();
}
