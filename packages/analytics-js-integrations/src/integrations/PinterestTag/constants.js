import {
  PINTEREST_TAG_NAME as NAME,
  PINTEREST_TAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'PinterestTag';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
