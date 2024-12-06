import { AXEPTIO_NAME as NAME, AXEPTIO_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Axeptio';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Axeptio: NAME,
  axeptio: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
