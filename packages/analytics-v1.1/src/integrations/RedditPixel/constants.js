import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'REDDIT_PIXEL';
const DISPLAY_NAME = 'Reddit Pixel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Reddit_Pixel: NAME,
  RedditPixel: NAME,
  REDDITPIXEL: NAME,
  redditpixel: NAME,
  'Reddit Pixel': NAME,
  'REDDIT PIXEL': NAME,
  'reddit pixel': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
