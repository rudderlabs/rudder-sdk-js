import { AM_NAME as NAME, AM_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Amplitude';

const CNameMapping = {
  [NAME]: NAME,
  AMPLITUDE: NAME,
  Amplitude: NAME,
  am: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
