import { BUGSNAG_NAME as NAME, BUGSNAG_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Bugsnag';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  bugsnag: NAME,
  Bugsnag: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { BUGSNAG_NAME as NAME, BUGSNAG_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
