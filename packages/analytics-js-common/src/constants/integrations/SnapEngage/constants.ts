import { SNAPENGAGE_NAME as NAME, SNAPENGAGE_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'SnapEngage';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  SnapEngage: NAME,
  Snap_Engage: NAME,
  snapengage: NAME,
  'SNAP ENGAGE': NAME,
  'Snap Engage': NAME,
  'snap engage': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
