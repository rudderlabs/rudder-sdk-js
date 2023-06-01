import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'GA4';
const DISPLAY_NAME = 'Google Analytics 4 (GA4)';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics 4': NAME,
  'Google analytics 4': NAME,
  'google analytics 4': NAME,
  'Google Analytics4': NAME,
  'Google analytics4': NAME,
  'google analytics4': NAME,
  GoogleAnalytics4: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
