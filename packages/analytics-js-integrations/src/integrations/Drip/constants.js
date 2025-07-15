import { DRIP_NAME as NAME, DRIP_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Drip';

const CNameMapping = {
  [NAME]: NAME,
  Drip: NAME,
  drip: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
