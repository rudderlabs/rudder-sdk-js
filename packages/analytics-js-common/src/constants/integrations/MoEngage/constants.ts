import { MOENGAGE_NAME as NAME, MOENGAGE_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'MoEngage';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  MoEngage: NAME,
  moengage: NAME,
  Moengage: NAME,
  'Mo Engage': NAME,
  'mo engage': NAME,
  'Mo engage': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { MOENGAGE_NAME as NAME, MOENGAGE_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
