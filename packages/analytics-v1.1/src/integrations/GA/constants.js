import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'GA';
const DISPLAY_NAME = 'Google Analytics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics': NAME,
  GoogleAnalytics: NAME,
  'GOOGLE ANALYTICS': NAME,
  'google analytics': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
