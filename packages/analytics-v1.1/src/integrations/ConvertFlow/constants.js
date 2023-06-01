import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'CONVERTFLOW';
const DISPLAY_NAME = 'ConvertFlow';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Convertflow: NAME,
  convertflow: NAME,
  convertFlow: NAME,
  ConvertFlow: NAME,
  'Convert flow': NAME,
  'convert flow': NAME,
  'convert Flow': NAME,
  'Convert Flow': NAME,
  'CONVERT FLOW': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
