import {
  BUGSNAG_NAME as NAME,
  BUGSNAG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Bugsnag';

const CNameMapping = {
  [NAME]: NAME,
  bugsnag: NAME,
  Bugsnag: NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'full';
const VENDOR_SDK_PINNED_URL = 'https://d2wy8f7a9ursnm.cloudfront.net/v6.5.2/bugsnag.min.js';
const VENDOR_SDK_INTEGRITY =
  'sha384-HLLE081l7CZ3SQUdBd9Lm13LHdl+BlWO54d1rVFhH4RCnCoXw9OUtxswT05Gp2V1';
const VENDOR_SDK_FLOATING_URL = 'https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js';

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME,
  DIR_NAME,
  VENDOR_SDK_PIN_SUPPORT,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
};
