import { PENDO_NAME as NAME, PENDO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Pendo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Pendo: NAME,
  pendo: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { PENDO_NAME as NAME, PENDO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
