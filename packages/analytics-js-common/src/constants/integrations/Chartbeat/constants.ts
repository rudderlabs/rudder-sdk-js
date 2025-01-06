import { CHARTBEAT_NAME as NAME, CHARTBEAT_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Chartbeat';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Chartbeat: NAME,
  chartbeat: NAME,
  'Chart Beat': NAME,
  'chart beat': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
