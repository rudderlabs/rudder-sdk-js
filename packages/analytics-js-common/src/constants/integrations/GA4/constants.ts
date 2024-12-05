import { GA4_NAME as NAME, GA4_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'GA4';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics 4': NAME,
  'Google analytics 4': NAME,
  'google analytics 4': NAME,
  'Google Analytics4': NAME,
  'Google analytics4': NAME,
  'google analytics4': NAME,
  'Google Analytics 4 (GA4)': NAME,
  'google analytics 4 (ga4)': NAME,
  GoogleAnalytics4: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { GA4_NAME as NAME, GA4_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
