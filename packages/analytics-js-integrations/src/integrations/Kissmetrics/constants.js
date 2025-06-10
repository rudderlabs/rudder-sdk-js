import {
  KISSMETRICS_NAME as NAME,
  KISSMETRICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Kissmetrics';

const CNameMapping = {
  [NAME]: NAME,
  Kissmetrics: NAME,
  kissmetrics: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
