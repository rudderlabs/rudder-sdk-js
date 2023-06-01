import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'OPTIMIZELY';
const DISPLAY_NAME = 'Optimizely Web';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Optimizely: NAME,
  optimizely: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
