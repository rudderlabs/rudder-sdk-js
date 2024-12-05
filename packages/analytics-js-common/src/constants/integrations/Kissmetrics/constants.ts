import {
  KISSMETRICS_NAME as NAME,
  KISSMETRICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'Kissmetrics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Kissmetrics: NAME,
  kissmetrics: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  KISSMETRICS_NAME as NAME,
  KISSMETRICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
