import * as cheerio from 'cheerio';
export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text()
    .trim()
    .replace(/hashtag#/g, ' #');
}
