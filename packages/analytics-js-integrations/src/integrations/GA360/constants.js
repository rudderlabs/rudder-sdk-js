import {
  GA360_NAME as NAME,
  GA360_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'GA360';

const CNameMapping = {
  [NAME]: NAME,
  'Google Analytics 360': NAME,
  'Google analytics 360': NAME,
  'google analytics 360': NAME,
  'Google Analytics360': NAME,
  'Google analytics360': NAME,
  'google analytics360': NAME,
  GoogleAnalytics360: NAME,
  'GA 360': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
