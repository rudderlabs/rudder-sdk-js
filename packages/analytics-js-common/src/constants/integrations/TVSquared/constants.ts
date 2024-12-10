import { TVSQUARED_NAME as NAME, TVSQUARED_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'TVSquared';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  TVSquared: NAME,
  tvsquared: NAME,
  tvSquared: NAME,
  TvSquared: NAME,
  Tvsquared: NAME,
  'TV Squared': NAME,
  'tv squared': NAME,
  'tv Squared': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
