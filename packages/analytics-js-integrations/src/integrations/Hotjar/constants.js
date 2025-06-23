import {
  HOTJAR_NAME as NAME,
  HOTJAR_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Hotjar';

const CNameMapping = {
  [NAME]: NAME,
  Hotjar: NAME,
  hotjar: NAME,
  'Hot Jar': NAME,
  'hot jar': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
