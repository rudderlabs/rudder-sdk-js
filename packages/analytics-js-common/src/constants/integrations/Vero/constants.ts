import { VERO_NAME as NAME, VERO_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Vero';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Vero: NAME,
  vero: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
