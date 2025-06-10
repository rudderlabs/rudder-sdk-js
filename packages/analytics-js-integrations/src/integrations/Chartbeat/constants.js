import {
  CHARTBEAT_NAME as NAME,
  CHARTBEAT_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Chartbeat';

const CNameMapping = {
  [NAME]: NAME,
  Chartbeat: NAME,
  chartbeat: NAME,
  'Chart Beat': NAME,
  'chart beat': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
