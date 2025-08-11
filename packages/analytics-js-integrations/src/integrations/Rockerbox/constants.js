import {
  ROCKERBOX_NAME as NAME,
  ROCKERBOX_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Rockerbox';

const CNameMapping = {
  [NAME]: NAME,
  Rockerbox: NAME,
  rockerbox: NAME,
  RockerBox: NAME,
  'Rocker box': NAME,
  'rocker box': NAME,
  'Rocker Box': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
