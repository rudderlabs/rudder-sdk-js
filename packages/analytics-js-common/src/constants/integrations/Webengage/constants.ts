const DIR_NAME = 'Webengage';
const NAME = 'WEBENGAGE';
const DISPLAY_NAME = 'WebEngage';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  webengage: NAME,
  Webengage: NAME,
  WebEngage: NAME,
  'web engage': NAME,
  'Web engage': NAME,
  'Web Engage': NAME,
  'WEB ENGAGE': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
