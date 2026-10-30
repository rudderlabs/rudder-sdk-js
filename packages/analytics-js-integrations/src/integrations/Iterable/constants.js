import { ITERABLE_NAME as NAME } from '../../constants/Destinations';

const DIR_NAME = 'Iterable';

const CNameMapping = {
  [NAME]: NAME,
  Iterable: NAME,
  iterable: NAME,
};

const VENDOR_SDK_PIN_SUPPORT = 'full';
const VENDOR_SDK_PINNED_URL = 'https://unpkg.com/@iterable/web-sdk@2.3.3/index.js';
const VENDOR_SDK_INTEGRITY =
  'sha384-RzEdjNnap/ghW3ER+a0s+gCQNO+U+mLgjw/UQ5QJc4tH6xUu+B41646M7Goqjxx9';
const VENDOR_SDK_FLOATING_URL = 'https://unpkg.com/@iterable/web-sdk/index.js';

export {
  NAME,
  CNameMapping,
  DIR_NAME,
  VENDOR_SDK_PIN_SUPPORT,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
};

export { ITERABLE_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
