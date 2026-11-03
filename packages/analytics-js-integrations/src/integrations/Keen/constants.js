import { KEEN_NAME as NAME } from '../../constants/Destinations';

const DIR_NAME = 'Keen';

const CNameMapping = {
  [NAME]: NAME,
  Keen: NAME,
  'Keen.io': NAME,
  keen: NAME,
  'keen.io': NAME,
};

const VENDOR_SDK_PINNED_URL =
  'https://cdn.jsdelivr.net/npm/keen-tracking@4.5.2/dist/keen-tracking.min.js';
const VENDOR_SDK_INTEGRITY =
  'sha384-Dd7Qck+inqhWjAcIYexF1G0yv4CXpo/3yTw5Y+sYZWTO4cyW1/xH3/4qCeHHyNLs';
const VENDOR_SDK_FLOATING_URL = 'https://cdn.jsdelivr.net/npm/keen-tracking@4';

export {
  NAME,
  CNameMapping,
  DIR_NAME,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
};

export { KEEN_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
