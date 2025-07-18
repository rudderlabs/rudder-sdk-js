import {
  CLEVERTAP_NAME as NAME,
  CLEVERTAP_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Clevertap';

const CNameMapping = {
  [NAME]: NAME,
  Clevertap: NAME,
  clevertap: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
