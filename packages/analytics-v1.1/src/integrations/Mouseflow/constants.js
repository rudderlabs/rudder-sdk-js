const DIR_NAME = 'Mouseflow';
const NAME = 'MOUSEFLOW';
const DISPLAY_NAME = 'Mouseflow';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Mouseflow: NAME,
  mouseflow: NAME,
  mouseFlow: NAME,
  MouseFlow: NAME,
  'Mouse flow': NAME,
  'mouse flow': NAME,
  'mouse Flow': NAME,
  'Mouse Flow': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
