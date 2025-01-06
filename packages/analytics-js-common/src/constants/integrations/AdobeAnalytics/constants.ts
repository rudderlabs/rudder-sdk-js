import {
  ADOBE_ANALYTICS_NAME as NAME,
  ADOBE_ANALYTICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../Destinations';

const DIR_NAME = 'AdobeAnalytics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
