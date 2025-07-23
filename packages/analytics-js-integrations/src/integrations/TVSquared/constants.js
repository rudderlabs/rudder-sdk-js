import {
  TVSQUARED_NAME as NAME,
  TVSQUARED_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'TVSquared';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
