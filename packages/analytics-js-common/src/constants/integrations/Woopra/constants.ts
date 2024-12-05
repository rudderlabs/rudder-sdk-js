import { WOOPRA_NAME as NAME, WOOPRA_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Woopra';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Woopra: NAME,
  woopra: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { WOOPRA_NAME as NAME, WOOPRA_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
