import { MATOMO_NAME as NAME, MATOMO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Matomo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Matomo: NAME,
  matomo: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { MATOMO_NAME as NAME, MATOMO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
