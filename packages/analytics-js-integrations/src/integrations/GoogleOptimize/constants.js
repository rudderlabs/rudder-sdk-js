import {
  GOOGLE_OPTIMIZE_NAME as NAME,
  GOOGLE_OPTIMIZE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'GoogleOptimize';

const CNameMapping = {
  [NAME]: NAME,
  'Google Optimize': NAME,
  GoogleOptimize: NAME,
  Googleoptimize: NAME,
  GOOGLEOPTIMIZE: NAME,
  'google optimize': NAME,
  'Google optimize': NAME,
  'GOOGLE OPTIMIZE': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
