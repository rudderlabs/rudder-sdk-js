const DIR_NAME = 'GA4_V2';
const NAME = 'GA4_V2';
const DISPLAY_NAME = 'Google Analytics 4 (GA4) V2';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
