import { VERO_NAME as NAME, VERO_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Vero';

const CNameMapping = {
  [NAME]: NAME,
  Vero: NAME,
  vero: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
