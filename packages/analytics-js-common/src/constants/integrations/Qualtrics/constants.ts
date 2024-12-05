import { QUALTRICS_NAME as NAME, QUALTRICS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Qualtrics';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Qualtrics: NAME,
  qualtrics: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { QUALTRICS_NAME as NAME, QUALTRICS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
