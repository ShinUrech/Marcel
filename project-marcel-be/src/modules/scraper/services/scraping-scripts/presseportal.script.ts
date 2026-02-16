/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
export async function getAllPressEportalArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.presseportal.ch/de/st/Bahn`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;
  const PAGES_COUNT = 1;
  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('main ul.article-list article')).map((article) => {
        const url = article.querySelector('h3 > a')?.getAttribute('href');
        const title = article.querySelector('h3 > a') as HTMLElement;
        const description = article.querySelector('p:nth-child(4)') as HTMLElement;
        const date = article.querySelector('.news-meta .date') as HTMLElement;

        const imageElement = article.querySelector('.news-img > img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          dateText: date?.innerText.trim() || 'N/A',
          teaser: description?.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    const nextButton = await page.evaluate(() => {
      const activePage = document.querySelector('div > span.btn.pagination-next')?.getAttribute('data-url');
      return activePage ? activePage : null;
    });

    if (!nextButton) {
      console.log('No more pages. Exiting...');
      break;
    }

    if (pageCount >= PAGES_COUNT) {
      break;
    }

    try {
      const nextPageUrl = `https://www.presseportal.ch/${nextButton.replace('@', '')}`;
      await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}

//**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
export async function getAllPressePortalEmArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://embed.presseportal.ch/de/100067295`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 4;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.article-link')).map((article) => {
        const url = article?.getAttribute('href');
        const title = article.querySelector('.article__title') as HTMLElement;
        const titleSub = article.querySelector('header > h2') as HTMLElement;
        const date = article.querySelector('.article__time time') as HTMLElement;

        const imageDiv = article.querySelector('.article__image-wrapper > div');
        let imageUrl = '';
        if (imageDiv) {
          const style = imageDiv.getAttribute('style');
          const match = style.match(/url\(['"]?(.*?)['"]?\)/);
          if (match) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            imageUrl = match[1];
          }
        }

        return {
          baseUrl: window.location.href,
          type: articleType,
          title: title?.innerText?.trim() || titleSub?.innerText?.trim() || 'N/A',
          url: url ? `${url}` : 'N/A',
          dateText: date?.innerText?.trim() || 'N/A',
          teaser: 'N/A',
          image: imageUrl ? `${imageUrl}` : 'N/A',
        };
      });
    }, ArticleType.News);

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://embed.presseportal.ch/de/100067295/${index + 1}/`;
      await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}

export async function getPressEportalArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body > main article > .card')).map((article: HTMLElement) => {
      return article.textContent;
    });
  });

  await browser.close();
  return originalArticle.join();
}

export async function getPressePortalAdArticle(pageUrl: string) {
  const { browser, page } = await getPuppeteerInstance();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  const originalArticle = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#main article > div.article__body')).map((article: HTMLElement) => {
      return article.innerText;
    });
  });

  await browser.close();
  return originalArticle.join();
}
