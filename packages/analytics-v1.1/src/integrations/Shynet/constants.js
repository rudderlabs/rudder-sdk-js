import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'SHYNET';
const DISPLAY_NAME = 'Shynet';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  shynet: NAME,
  ShyNet: NAME,
  shyNet: NAME,
  Shynet: NAME,
  'shy net': NAME,
  'Shy Net': NAME,
  'shy Net': NAME,
  'Shy net': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
