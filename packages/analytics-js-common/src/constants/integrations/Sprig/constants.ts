import { SPRIG_NAME as NAME, SPRIG_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Sprig';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Sprig: NAME,
  sprig: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
