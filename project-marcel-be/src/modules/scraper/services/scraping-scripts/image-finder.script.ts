/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

export async function searchBetterImage(imagePath) {
  const { browser, page } = await getPuppeteerInstance();

  // // Go to Google Lens search page
  // await page.goto('https://lens.google.com/upload');

  // // Upload the image by setting the input value
  // const [fileChooser] = await Promise.all([
  //   page.waitForFileChooser(),
  //   page.click('input[type="file"]'), // Click on file input
  // ]);

  // // Simulate uploading an image from the URL
  // await fileChooser.accept([imageUrl]);

  // // Wait for results to load
  // await page.waitForSelector('a[jsname="sTFXNd"]');

  // // Extract the first high-quality match
  // const imageLinks = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('a[jsname="sTFXNd"]'))
  //     .map((el: HTMLElement) => el.getAttribute('href'))
  //     .slice(0, 5); // Get top 5 matches
  // });

  // await browser.close();
  // return imageLinks.length ? imageLinks : 'No better image found.';
  // Navigate to Google Images Search
  await page.goto('https://www.google.com/imghp');

  // Click on the camera icon for "Search by image"
  await page.waitForSelector('div[data-base-lens-url="https://lens.google.com"]');
  await page.click('div[data-base-lens-url="https://lens.google.com"]');

  // Click on "Upload an image"
  // Wait for file input to appear
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('span[role="button"]:not(:has(*)):not(:empty)'), // Adjusted selector for new UI
  ]);

  // Upload the image file
  await fileChooser.accept([imagePath]);

  // Wait for results
  await page.waitForSelector('a.wXeWr');

  // Get image results
  const imageLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a.wXeWr'))
      .map((el) => el.getAttribute('href'))
      .slice(0, 5); // Get top 5 best-quality images
  });

  await browser.close();
  return imageLinks.length ? imageLinks : 'No better image found.';
}
