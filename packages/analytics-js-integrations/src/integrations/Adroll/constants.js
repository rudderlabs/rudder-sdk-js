import {
  ADROLL_NAME as NAME,
  ADROLL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Adroll';

const CNameMapping = {
  [NAME]: NAME,
  Adroll: NAME,
  'Ad roll': NAME,
  'ad roll': NAME,
  adroll: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
