import {
  PENDO_NAME as NAME,
  PENDO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Pendo';

const CNameMapping = {
  [NAME]: NAME,
  Pendo: NAME,
  pendo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
