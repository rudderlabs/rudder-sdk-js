import { DRIP_NAME as NAME, DRIP_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Drip';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Drip: NAME,
  drip: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { DRIP_NAME as NAME, DRIP_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
