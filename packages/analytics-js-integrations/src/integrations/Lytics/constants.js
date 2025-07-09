import {
  LYTICS_NAME as NAME,
  LYTICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Lytics';

const CNameMapping = {
  [NAME]: NAME,
  Lytics: NAME,
  lytics: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
