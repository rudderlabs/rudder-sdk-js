import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'MOENGAGE';
const DISPLAY_NAME = 'MoEngage';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  MoEngage: NAME,
  moengage: NAME,
  Moengage: NAME,
  'Mo Engage': NAME,
  'mo engage': NAME,
  'Mo engage': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
