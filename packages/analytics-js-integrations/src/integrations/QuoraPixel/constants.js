import {
  QUORA_PIXEL_NAME as NAME,
  QUORA_PIXEL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'QuoraPixel';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
