import { SENTRY_NAME as NAME } from '../../constants/Destinations';

export { SENTRY_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Sentry';
const SENTRY_SDK_VERSION = '7.120.4';
const SENTRY_SDK_ID = `rudder-sentry-${SENTRY_SDK_VERSION}-sdk`;
const SENTRY_SDK_URL = 'https://browser.sentry-cdn.com/7.120.4/bundle.es5.min.js';
const SENTRY_SDK_INTEGRITY =
  'sha384-DThi/zlFXuN6Ok27a9CexeQ2xJhyvNgqZMkj0SXm4JBVg4BnEd3twSxB5oKXva3P';
const SENTRY_REWRITE_FRAMES_ID = `rudder-sentry-${SENTRY_SDK_VERSION}-rewrite-frames`;
const SENTRY_REWRITE_FRAMES_URL = 'https://browser.sentry-cdn.com/7.120.4/rewriteframes.es5.min.js';
const SENTRY_REWRITE_FRAMES_INTEGRITY =
  'sha384-aPAXdgRLWL0KzsqqJ3Ocofd3WWn9nGQczGsRSsokosNPbJhO6cCVfQTjfzroTlY+';

const CNameMapping = {
  [NAME]: NAME,
  sentry: NAME,
  Sentry: NAME,
};

export {
  NAME,
  CNameMapping,
  DIR_NAME,
  SENTRY_SDK_VERSION,
  SENTRY_SDK_ID,
  SENTRY_SDK_URL,
  SENTRY_SDK_INTEGRITY,
  SENTRY_REWRITE_FRAMES_ID,
  SENTRY_REWRITE_FRAMES_URL,
  SENTRY_REWRITE_FRAMES_INTEGRITY,
};
