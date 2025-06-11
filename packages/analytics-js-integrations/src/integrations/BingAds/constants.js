import {
  BINGADS_NAME as NAME,
  BINGADS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'BingAds';

const CNameMapping = {
  [NAME]: NAME,
  BingAds: NAME,
  bingads: NAME,
  'Bing Ads': NAME,
  'Bing ads': NAME,
  'bing Ads': NAME,
  'bing ads': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
