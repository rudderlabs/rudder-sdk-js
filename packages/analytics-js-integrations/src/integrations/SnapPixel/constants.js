import {
  SNAP_PIXEL_NAME as NAME,
  SNAP_PIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'SnapPixel';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
