import {
  SPRIG_NAME as NAME,
  SPRIG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Sprig';

const CNameMapping = {
  [NAME]: NAME,
  Sprig: NAME,
  sprig: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
