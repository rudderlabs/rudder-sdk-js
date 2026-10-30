import { SHYNET_NAME as NAME } from '../../constants/Destinations';

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

const VENDOR_SDK_PIN_SUPPORT = 'no-script';

export { VENDOR_SDK_PIN_SUPPORT, NAME, CNameMapping, DIR_NAME };

export { SHYNET_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
