import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'COMSCORE';
const DISPLAY_NAME = 'Comscore';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Comscore: NAME,
  'Com Score': NAME,
  'com Score': NAME,
  'com score': NAME,
  'Com score': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
