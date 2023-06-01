import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'OLARK';
const DISPLAY_NAME = 'Olark';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Olark: NAME,
  olark: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
