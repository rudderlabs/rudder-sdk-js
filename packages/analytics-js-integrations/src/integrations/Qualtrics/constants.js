import {
  QUALTRICS_NAME as NAME,
  QUALTRICS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Qualtrics';

const CNameMapping = {
  [NAME]: NAME,
  Qualtrics: NAME,
  qualtrics: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
