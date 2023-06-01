import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'WOOPRA';
const DISPLAY_NAME = 'Woopra';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Woopra: NAME,
  woopra: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
