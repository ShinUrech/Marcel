/* eslint-disable prettier/prettier */
import { JSDOM } from 'jsdom';

export const getInnerBody = (htmlString) => {
  const dom = new JSDOM(htmlString);
  const bodyContent = dom.window.document.body.innerHTML.trim();
  return bodyContent.replace(/```html\n\n|\n\n```/g, '').trim();
};
