import { LAUNCHDARKLY_NAME as NAME } from '../../constants/Destinations';

const DIR_NAME = 'LaunchDarkly';

const CNameMapping = {
  [NAME]: NAME,
  LaunchDarkly: NAME,
  Launch_Darkly: NAME,
  'Launch Darkly': NAME,
  launchDarkly: NAME,
  'launch darkly': NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'full';
const VENDOR_SDK_PINNED_URL =
  'https://unpkg.com/launchdarkly-js-client-sdk@2.24.2/dist/ldclient.min.js';
const VENDOR_SDK_INTEGRITY =
  'sha384-n/oFkkwm6UKpr8pGEbmNoGKFjm8npB9KfZsG0HT7N89mdKXeIGiTS2r9qTwHl+aI';
const VENDOR_SDK_FLOATING_URL = 'https://unpkg.com/launchdarkly-js-client-sdk@2';

export {
  NAME,
  CNameMapping,
  DIR_NAME,
  VENDOR_SDK_PIN_SUPPORT,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
};

export { LAUNCHDARKLY_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
