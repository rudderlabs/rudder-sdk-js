import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'LYTICS';
const DISPLAY_NAME = 'Lytics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Lytics: NAME,
  lytics: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
