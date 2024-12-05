import { CLEVERTAP_NAME as NAME, CLEVERTAP_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Clevertap';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Clevertap: NAME,
  clevertap: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { CLEVERTAP_NAME as NAME, CLEVERTAP_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
