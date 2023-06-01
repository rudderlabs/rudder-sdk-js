import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'PINTEREST_TAG';
const DISPLAY_NAME = 'Pinterest Tag';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  PinterestTag: NAME,
  Pinterest_Tag: NAME,
  PINTERESTTAG: NAME,
  pinterest: NAME,
  PinterestAds: NAME,
  Pinterest_Ads: NAME,
  Pinterest: NAME,
  'Pinterest Tag': NAME,
  'Pinterest tag': NAME,
  'PINTEREST TAG': NAME,
  'pinterest tag': NAME,
  'Pinterest Ads': NAME,
  'Pinterest ads': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
