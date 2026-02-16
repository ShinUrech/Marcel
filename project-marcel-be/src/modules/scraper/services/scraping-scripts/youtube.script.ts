/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

//**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT
export const getAllVideos = async (channelName: string): Promise<any[]> => {
  const { browser, page } = await getPuppeteerInstance();

  const channelUrl = `https://www.youtube.com/@${channelName}/videos`;
  await page.goto(channelUrl, { waitUntil: 'networkidle2' });
  try {
    const acceptCookiesSelector = 'button[aria-label="Accept all"]';
    const acceptCookies = await page.$(acceptCookiesSelector);
    await acceptCookies.click();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.log(error);
  }

  // Scroll down to load all videos
  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;
  }
  const videos = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('ytd-rich-grid-media')).map((video) => ({
      baseUrl: window.location.href,
      type: articleType,
      title: (video.querySelector('a#video-title-link') as HTMLElement)?.innerText.trim() || 'N/A',
      url: `https://www.youtube.com${video.querySelector('a#video-title-link')?.getAttribute('href') || ''}`,
      dateText: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
      image: video.querySelector('img')?.getAttribute('src') || 'N/A',
      originalContent: 'N/A',
      metadata: {
        views: (video.querySelector('span.inline-metadata-item') as HTMLElement)?.innerText.trim() || 'N/A',
        uploadDate: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
        duration: (video.querySelector('ytd-thumbnail-overlay-time-status-renderer') as HTMLElement)?.innerText.trim(),
      },
    }));
  }, ArticleType.Video);

  await browser.close();
  return videos;
};

//**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT WITH SEARCH
export const getAllVideosFromSearch = async (channelName: string, term: string): Promise<any[]> => {
  const { browser, page } = await getPuppeteerInstance();

  const channelUrl = `https://www.youtube.com/@${channelName}/search?query=${term}`;
  await page.goto(channelUrl, { waitUntil: 'networkidle2' });

  try {
    const acceptCookiesSelector = 'button[aria-label="Accept all"]';
    const acceptCookies = await page.$(acceptCookiesSelector);
    await acceptCookies.click();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.log(error);
  }
  // Scroll down to load all videos
  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;
  }

  const videos = await page.evaluate((articleType) => {
    return Array.from(document.querySelectorAll('ytd-item-section-renderer')).map((video) => ({
      baseUrl: window.location.href,
      type: articleType,
      dateText: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
      title: (video.querySelector('yt-formatted-string.ytd-video-renderer') as HTMLElement)?.innerText.trim() || 'N/A',
      url: `https://www.youtube.com${video.querySelector('a#video-title')?.getAttribute('href') || ''}`,
      image: video.querySelector('img')?.getAttribute('src') || 'N/A',
      originalContent: (video.querySelector('yt-formatted-string#description-text') as HTMLElement)?.innerText.trim(),
      metadata: {
        views: (video.querySelector('span.inline-metadata-item') as HTMLElement)?.innerText.trim() || 'N/A',
        uploadDate: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
        duration: (video.querySelector('ytd-thumbnail-overlay-time-status-renderer') as HTMLElement)?.innerText.trim(),
      },
    }));
  }, ArticleType.Video);

  await browser.close();
  return videos;
};
