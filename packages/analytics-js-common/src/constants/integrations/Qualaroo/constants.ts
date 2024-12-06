import { QUALAROO_NAME as NAME, QUALAROO_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Qualaroo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Qualaroo: NAME,
  qualaroo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
