import {
  APPCUES_NAME as NAME,
  APPCUES_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Appcues';

const CNameMapping = {
  [NAME]: NAME,
  Appcues: NAME,
  'App Cues': NAME,
  appcues: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
