import {
  WOOPRA_NAME as NAME,
  WOOPRA_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Woopra';

const CNameMapping = {
  [NAME]: NAME,
  Woopra: NAME,
  woopra: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
