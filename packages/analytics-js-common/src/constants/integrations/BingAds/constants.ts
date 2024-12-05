import { BINGADS_NAME as NAME, BINGADS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'BingAds';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  BingAds: NAME,
  bingads: NAME,
  'Bing Ads': NAME,
  'Bing ads': NAME,
  'bing Ads': NAME,
  'bing ads': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { BINGADS_NAME as NAME, BINGADS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
