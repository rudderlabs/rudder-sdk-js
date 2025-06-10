import {
  MATOMO_NAME as NAME,
  MATOMO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Matomo';

const CNameMapping = {
  [NAME]: NAME,
  Matomo: NAME,
  matomo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
