import {
  REDDIT_PIXEL_NAME as NAME,
  REDDIT_PIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../Destinations';

const DIR_NAME = 'RedditPixel';

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
