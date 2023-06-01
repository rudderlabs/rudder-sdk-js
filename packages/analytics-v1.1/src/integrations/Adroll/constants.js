import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'ADROLL';
const DISPLAY_NAME = 'Adroll';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Adroll: NAME,
  'Ad roll': NAME,
  'ad roll': NAME,
  adroll: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
