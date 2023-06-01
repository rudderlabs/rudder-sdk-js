import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'SNAP_PIXEL';
const DISPLAY_NAME = 'Snap Pixel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Snap_Pixel: NAME,
  SnapPixel: NAME,
  SNAPPIXEL: NAME,
  snappixel: NAME,
  'Snap Pixel': NAME,
  'SNAP PIXEL': NAME,
  'snap pixel': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
