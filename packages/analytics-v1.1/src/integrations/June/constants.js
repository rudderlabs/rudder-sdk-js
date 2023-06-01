import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'JUNE';
const DISPLAY_NAME = 'June';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  June: NAME,
  june: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
