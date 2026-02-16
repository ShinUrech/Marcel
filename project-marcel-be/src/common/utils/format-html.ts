/* eslint-disable prettier/prettier */
import * as cheerio from 'cheerio';

function cleanHTML(html, selectors) {
  const $ = cheerio.load(html);

  // Remove elements based on selectors
  selectors.forEach((selector) => $(selector).remove());

  return $('body').html();
}

export function formatHtmlLinkedIn(htmlString: string) {
  const html = htmlString.replace(/\n/g, '').trim();

  const elementsToRemove = ['.see-more'];

  const cleanedHTML = cleanHTML(html, elementsToRemove);
  return cleanedHTML;
}

export function formatHtmlVideo(htmlString: string) {
  const html = htmlString.replace(/\n/g, '').trim();

  const elementsToRemove = ['iframe'];

  const cleanedHTML = cleanHTML(html, elementsToRemove);
  return cleanedHTML;
}
