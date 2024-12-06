import { OPTIMIZELY_NAME as NAME, OPTIMIZELY_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Optimizely';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Optimizely: NAME,
  optimizely: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
