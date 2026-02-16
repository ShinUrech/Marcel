/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "voev.ch/" SCRAPPING SCRIPT
// TODO : [ON-HOLD]
export async function getAllVoevArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.voev.ch/de/Medien/Mediencorner/Medienmitteilungen?section=News&cmd=2&pos=0`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 2;

  for (let index = 0; index < PAGES_COUNT; index++) {
    pageCount++;
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate(() => {
      // return Array.from(document.querySelectorAll('.news-list > .news-row')).map((article) => {
      //   console.log('---> article');
      //   const newsRow = article.querySelector('.news-row') as HTMLElement;
      //   if (!newsRow) return null;
      //   console.log('---> newsRow', newsRow);
      //   // const url = article.querySelector('h2 a')?.getAttribute('href');
      //   // const title = article.querySelector('h2 a') as HTMLElement;

      //   // const dateMatch = newsRow.innerText.match(/\d{2}\.\d{2}\.\d{4}/);
      //   // const date = dateMatch ? dateMatch[0] : '';

      //   // const description = newsRow.innerText
      //   //   .replace(date, '') // Remove the date
      //   //   .replace(title?.textContent?.trim(), '') // Remove the title
      //   //   .trim();

      //   return {
      //     // title: title?.textContent?.trim() || 'N/A',
      //     // url: `${url}` || 'N/A',
      //     // date: date || 'N/A',
      //     // description: description || 'N/A',
      //     image: 'N/A',
      //   };
      // });
      console.log(
        "--> document.querySelectorAll('.news-list > .news-row')",
        document.querySelectorAll('#c7n-content .news-row'),
      );
      return '';
    });

    articles.push(...teaserArticles);

    //   // try {
    //   //   const nextPageUrl = `https://www.voev.ch/de/Medien/Mediencorner/Medienmitteilungen?section=News&cmd=2&pos=${index * 30}/`;
    //   //   await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
    //   //   pageCount++;
    //   //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   // } catch (_err) {
    //   //   break;
    //   // }
  }

  await browser.close();
  return articles;
}
