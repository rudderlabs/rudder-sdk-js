import { BINGADS_NAME as NAME, BINGADS_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
