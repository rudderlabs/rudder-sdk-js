import { GA_NAME as NAME, GA_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'GA';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics': NAME,
  GoogleAnalytics: NAME,
  'GOOGLE ANALYTICS': NAME,
  'google analytics': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { GA_NAME as NAME, GA_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
