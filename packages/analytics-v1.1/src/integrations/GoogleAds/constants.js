import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'GOOGLEADS';
const DISPLAY_NAME = 'Google Ads';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Ads': NAME,
  GoogleAds: NAME,
  'GOOGLE ADS': NAME,
  'google ads': NAME,
  googleads: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
