import { HOTJAR_NAME as NAME, HOTJAR_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Hotjar';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Hotjar: NAME,
  hotjar: NAME,
  'Hot Jar': NAME,
  'hot jar': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { HOTJAR_NAME as NAME, HOTJAR_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
