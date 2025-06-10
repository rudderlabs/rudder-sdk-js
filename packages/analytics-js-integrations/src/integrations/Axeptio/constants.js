import {
  AXEPTIO_NAME as NAME,
  AXEPTIO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Axeptio';

const CNameMapping = {
  [NAME]: NAME,
  Axeptio: NAME,
  axeptio: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
