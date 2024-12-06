import { KEEN_NAME as NAME, KEEN_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Keen';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Keen: NAME,
  'Keen.io': NAME,
  keen: NAME,
  'keen.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
