import { ADROLL_NAME as NAME, ADROLL_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Adroll';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Adroll: NAME,
  'Ad roll': NAME,
  'ad roll': NAME,
  adroll: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { ADROLL_NAME as NAME, ADROLL_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
