import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'AM';
const DISPLAY_NAME = 'Amplitude';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  AMPLITUDE: NAME,
  Amplitude: NAME,
  am: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
