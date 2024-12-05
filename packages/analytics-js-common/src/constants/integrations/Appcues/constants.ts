import { APPCUES_NAME as NAME, APPCUES_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Appcues';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Appcues: NAME,
  'App Cues': NAME,
  appcues: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { APPCUES_NAME as NAME, APPCUES_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
