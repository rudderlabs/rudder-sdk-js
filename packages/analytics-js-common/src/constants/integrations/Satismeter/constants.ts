import { SATISMETER_NAME as NAME, SATISMETER_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Satismeter';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Satismeter: NAME,
  SatisMeter: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
