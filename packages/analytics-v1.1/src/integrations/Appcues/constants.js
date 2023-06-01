import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'APPCUES';
const DISPLAY_NAME = 'Appcues';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Appcues: NAME,
  'App Cues': NAME,
  appcues: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
