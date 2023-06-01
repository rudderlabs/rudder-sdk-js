import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'ADOBE_ANALYTICS';
const DISPLAY_NAME = 'Adobe Analytics';

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
