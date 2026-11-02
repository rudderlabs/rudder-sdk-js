import {
  SHYNET_NAME as NAME,
  SHYNET_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Shynet';

const CNameMapping = {
  [NAME]: NAME,
  shynet: NAME,
  ShyNet: NAME,
  shyNet: NAME,
  Shynet: NAME,
  'shy net': NAME,
  'Shy Net': NAME,
  'shy Net': NAME,
  'Shy net': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
