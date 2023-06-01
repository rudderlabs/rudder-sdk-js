import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'VERO';
const DISPLAY_NAME = 'Vero';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Vero: NAME,
  vero: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
