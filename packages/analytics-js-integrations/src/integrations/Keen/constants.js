import { KEEN_NAME as NAME, KEEN_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Keen';

const CNameMapping = {
  [NAME]: NAME,
  Keen: NAME,
  'Keen.io': NAME,
  keen: NAME,
  'keen.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
