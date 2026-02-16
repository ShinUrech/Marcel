export const getInnerBody = (htmlString: string) => {
  return htmlString.replace(/```html|```/g, '').trim();
};
