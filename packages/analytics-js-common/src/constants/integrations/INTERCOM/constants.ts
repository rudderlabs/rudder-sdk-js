import { INTERCOM_NAME as NAME, INTERCOM_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'INTERCOM';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Intercom: NAME,
  intercom: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
