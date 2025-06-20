import {
  LOTAME_NAME as NAME,
  LOTAME_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Lotame';

const CNameMapping = {
  [NAME]: NAME,
  Lotame: NAME,
  lotame: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
