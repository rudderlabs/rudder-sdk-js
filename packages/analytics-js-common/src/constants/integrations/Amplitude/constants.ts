import { AM_NAME as NAME, AM_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Amplitude';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  AMPLITUDE: NAME,
  Amplitude: NAME,
  am: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
