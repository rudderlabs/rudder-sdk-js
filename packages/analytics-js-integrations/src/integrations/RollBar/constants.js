import {
  ROLLBAR_NAME as NAME,
  ROLLBAR_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'RollBar';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
