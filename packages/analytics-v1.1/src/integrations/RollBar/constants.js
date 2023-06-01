import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'ROLLBAR';
const DISPLAY_NAME = 'RollBar';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  RollBar: NAME,
  Roll_Bar: NAME,
  rollbar: NAME,
  Rollbar: NAME,
  'ROLL BAR': NAME,
  'Roll Bar': NAME,
  'roll bar': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
