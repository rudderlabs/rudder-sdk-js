import {
  BUGSNAG_NAME as NAME,
  BUGSNAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Bugsnag';

const CNameMapping = {
  [NAME]: NAME,
  bugsnag: NAME,
  Bugsnag: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
