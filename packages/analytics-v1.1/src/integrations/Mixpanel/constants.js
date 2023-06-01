const DIR_NAME = 'Mixpanel';
const NAME = 'MP';
const DISPLAY_NAME = 'Mixpanel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  MIXPANEL: NAME,
  Mixpanel: NAME,
  'MIX PANEL': NAME,
  'Mix panel': NAME,
  'Mix Panel': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
