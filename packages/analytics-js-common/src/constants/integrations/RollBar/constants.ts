import { ROLLBAR_NAME as NAME, ROLLBAR_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'RollBar';

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

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { ROLLBAR_NAME as NAME, ROLLBAR_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
