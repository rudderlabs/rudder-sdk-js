import { LOTAME_NAME as NAME, LOTAME_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Lotame';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Lotame: NAME,
  lotame: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
