import { OLARK_NAME as NAME, OLARK_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Olark';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Olark: NAME,
  olark: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
