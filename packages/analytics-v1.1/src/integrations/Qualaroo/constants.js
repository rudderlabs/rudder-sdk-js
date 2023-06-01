import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'QUALAROO';
const DISPLAY_NAME = 'Qualaroo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Qualaroo: NAME,
  qualaroo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
