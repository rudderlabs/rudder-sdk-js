import {
  GOOGLEADS_NAME as NAME,
  GOOGLEADS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'GoogleAds';

const CNameMapping = {
  [NAME]: NAME,
  'Google Ads': NAME,
  GoogleAds: NAME,
  'GOOGLE ADS': NAME,
  'google ads': NAME,
  googleads: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
