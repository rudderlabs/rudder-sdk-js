import {
  REFINER_NAME as NAME,
  REFINER_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Refiner';

const CNameMapping = {
  [NAME]: NAME,
  Refiner: NAME,
  refiner: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
