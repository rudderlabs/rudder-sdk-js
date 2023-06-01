import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'QUORA_PIXEL';
const DISPLAY_NAME = 'Quora Pixel';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
