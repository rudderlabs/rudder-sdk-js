const DIR_NAME = 'Hotjar';
const NAME = 'HOTJAR';
const DISPLAY_NAME = 'Hotjar';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Hotjar: NAME,
  hotjar: NAME,
  'Hot Jar': NAME,
  'hot jar': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
