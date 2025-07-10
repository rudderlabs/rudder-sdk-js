import {
  GA4_V2_NAME as NAME,
  GA4_V2_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'GA4_V2';

const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics 4 V2': NAME,
  'Google analytics 4 V2': NAME,
  'google analytics 4 V2': NAME,
  'Google Analytics4 V2': NAME,
  'Google analytics4 V2': NAME,
  'google analytics4 V2': NAME,
  'Google Analytics 4 (GA4) V2': NAME,
  'google analytics 4 (ga4) V2': NAME,
  GoogleAnalytics4V2: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
