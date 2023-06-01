import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'GOOGLE_OPTIMIZE';
const DISPLAY_NAME = 'Google Optimize';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
