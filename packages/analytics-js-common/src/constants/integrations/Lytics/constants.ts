import { LYTICS_NAME as NAME, LYTICS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Lytics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Lytics: NAME,
  lytics: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { LYTICS_NAME as NAME, LYTICS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
