import {
  QUALAROO_NAME as NAME,
  QUALAROO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Qualaroo';

const CNameMapping = {
  [NAME]: NAME,
  Qualaroo: NAME,
  qualaroo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
