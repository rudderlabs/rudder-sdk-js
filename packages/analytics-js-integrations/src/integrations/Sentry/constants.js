import {
  SENTRY_NAME as NAME,
  SENTRY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Sentry';

const CNameMapping = {
  [NAME]: NAME,
  sentry: NAME,
  Sentry: NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'full';

export { VENDOR_SDK_PIN_SUPPORT, NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
