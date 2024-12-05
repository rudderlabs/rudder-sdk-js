import { LOTAME_NAME as NAME, LOTAME_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Lotame';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Lotame: NAME,
  lotame: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { LOTAME_NAME as NAME, LOTAME_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
