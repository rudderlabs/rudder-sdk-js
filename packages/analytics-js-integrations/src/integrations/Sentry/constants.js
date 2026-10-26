import {
  SENTRY_NAME as NAME,
  SENTRY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Sentry';
const SENTRY_SDK_VERSION = '11.6.0';
const SENTRY_CDN_BASE_URL = `https://browser.sentry-cdn.com/${SENTRY_SDK_VERSION}`;
const SENTRY_SDK_ID = `rudder-sentry-${SENTRY_SDK_VERSION}-sdk`;
const SENTRY_SDK_URL = `${SENTRY_CDN_BASE_URL}/bundle.min.js`;
const SENTRY_SDK_INTEGRITY =
  'sha384-rlznaM0ZTdlKZRMeVO8a43/HbvKhLqHABk8FFcshozlZDT84nCfG8GdTIWeQioHe';
const SENTRY_REWRITE_FRAMES_ID = `rudder-sentry-${SENTRY_SDK_VERSION}-rewrite-frames`;
const SENTRY_REWRITE_FRAMES_URL = `${SENTRY_CDN_BASE_URL}/rewriteframes.min.js`;
const SENTRY_REWRITE_FRAMES_INTEGRITY =
  'sha384-wr5WXNPJhwYJOBmdmTeEbeA5Qxx3uO5u7fU0CFiOGFgt45iYtMU9CxdYizOyr10U';

const CNameMapping = {
  [NAME]: NAME,
  sentry: NAME,
  Sentry: NAME,
};

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME,
  DIR_NAME,
  SENTRY_SDK_VERSION,
  SENTRY_SDK_ID,
  SENTRY_SDK_URL,
  SENTRY_SDK_INTEGRITY,
  SENTRY_REWRITE_FRAMES_ID,
  SENTRY_REWRITE_FRAMES_URL,
  SENTRY_REWRITE_FRAMES_INTEGRITY,
};
