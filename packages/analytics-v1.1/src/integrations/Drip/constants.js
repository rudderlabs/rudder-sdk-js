import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'DRIP';
const DISPLAY_NAME = 'Drip';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Drip: NAME,
  drip: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
