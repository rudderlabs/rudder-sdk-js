import { GOOGLEADS_NAME as NAME, GOOGLEADS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'GoogleAds';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Ads': NAME,
  GoogleAds: NAME,
  'GOOGLE ADS': NAME,
  'google ads': NAME,
  googleads: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { GOOGLEADS_NAME as NAME, GOOGLEADS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
