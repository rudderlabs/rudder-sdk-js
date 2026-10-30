import {
  LOTAME_NAME as NAME,
  LOTAME_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Lotame';

const CNameMapping = {
  [NAME]: NAME,
  Lotame: NAME,
  lotame: NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'no-script';

export { VENDOR_SDK_PIN_SUPPORT, NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
