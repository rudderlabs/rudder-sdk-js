import {
  QUORA_PIXEL_NAME as NAME,
  QUORA_PIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'QuoraPixel';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Quora Pixel': NAME,
  'Quora pixel': NAME,
  'QUORA PIXEL': NAME,
  QuoraPixel: NAME,
  Quorapixel: NAME,
  QUORAPIXEL: NAME,
  Quora_Pixel: NAME,
  quora_pixel: NAME,
  Quora: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  QUORA_PIXEL_NAME as NAME,
  QUORA_PIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
