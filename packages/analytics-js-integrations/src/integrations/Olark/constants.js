import {
  OLARK_NAME as NAME,
  OLARK_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Olark';

const CNameMapping = {
  [NAME]: NAME,
  Olark: NAME,
  olark: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
