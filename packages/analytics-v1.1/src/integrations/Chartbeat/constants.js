const DIR_NAME = 'Chartbeat';
const NAME = 'CHARTBEAT';
const DISPLAY_NAME = 'Chartbeat';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Chartbeat: NAME,
  chartbeat: NAME,
  'Chart Beat': NAME,
  'chart beat': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
