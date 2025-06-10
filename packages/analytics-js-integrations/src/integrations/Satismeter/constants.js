import {
  SATISMETER_NAME as NAME,
  SATISMETER_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Satismeter';

const CNameMapping = {
  [NAME]: NAME,
  Satismeter: NAME,
  SatisMeter: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
