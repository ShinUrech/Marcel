/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gis = require('async-g-i-s');
import { largeImages } from '../utils/enhance-image';

export default async function getImage(query, index = 0) {
  const results = await gis(query);
  const lrgImgs = largeImages(results);
  return lrgImgs[Math.min(index, results.length - 1)];
}
