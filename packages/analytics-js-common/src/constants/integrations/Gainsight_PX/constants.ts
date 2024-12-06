import {
  GAINSIGHT_PX_NAME as NAME,
  GAINSIGHT_PX_DISPLAY_NAME as DISPLAY_NAME,
} from '../Destinations';

const DIR_NAME = 'Gainsight_PX';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Gainsight_PX: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
