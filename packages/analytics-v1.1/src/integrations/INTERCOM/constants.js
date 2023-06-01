import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'INTERCOM';
const DISPLAY_NAME = 'Intercom';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Intercom: NAME,
  intercom: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
