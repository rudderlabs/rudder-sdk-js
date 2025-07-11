import {
  INTERCOM_NAME as NAME,
  INTERCOM_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'INTERCOM';

const CNameMapping = {
  [NAME]: NAME,
  Intercom: NAME,
  intercom: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
