import {
  GAINSIGHT_PX_NAME as NAME,
  GAINSIGHT_PX_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Gainsight_PX';

const CNameMapping = {
  [NAME]: NAME,
  Gainsight_PX: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
