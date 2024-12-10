import { REFINER_NAME as NAME, REFINER_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Refiner';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Refiner: NAME,
  refiner: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
