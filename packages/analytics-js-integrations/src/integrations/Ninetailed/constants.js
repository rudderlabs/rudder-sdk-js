import {
  NINETAILED_NAME as NAME,
  NINETAILED_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Ninetailed';

const CNameMapping = {
  [NAME]: NAME,
  Ninetailed: NAME,
  ninetailed: NAME,
  NineTailed: NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'no-script';

export { VENDOR_SDK_PIN_SUPPORT, NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
