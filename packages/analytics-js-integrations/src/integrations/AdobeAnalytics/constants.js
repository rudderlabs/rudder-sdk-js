import {
  ADOBE_ANALYTICS_NAME as NAME,
  ADOBE_ANALYTICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'AdobeAnalytics';

const CNameMapping = {
  'Adobe Analytics': NAME,
  ADOBEANALYTICS: NAME,
  'ADOBE ANALYTICS': NAME,
  [NAME]: NAME,
  AdobeAnalytics: NAME,
  adobeanalytics: NAME,
  'adobe analytics': NAME,
  'Adobe analytics': NAME,
  'adobe Analytics': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
