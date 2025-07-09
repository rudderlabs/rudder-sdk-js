import { GA_NAME as NAME, GA_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'GA';

const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics': NAME,
  GoogleAnalytics: NAME,
  'GOOGLE ANALYTICS': NAME,
  'google analytics': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
