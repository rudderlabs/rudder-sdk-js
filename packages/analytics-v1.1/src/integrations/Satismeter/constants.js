import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'SATISMETER';
const DISPLAY_NAME = 'Satismeter';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Satismeter: NAME,
  SatisMeter: NAME,
  SATISMETER: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
