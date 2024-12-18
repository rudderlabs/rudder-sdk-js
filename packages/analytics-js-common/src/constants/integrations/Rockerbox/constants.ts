import { ROCKERBOX_NAME as NAME, ROCKERBOX_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Rockerbox';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Rockerbox: NAME,
  rockerbox: NAME,
  RockerBox: NAME,
  'Rocker box': NAME,
  'rocker box': NAME,
  'Rocker Box': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
