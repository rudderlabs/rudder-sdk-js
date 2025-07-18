// Reserved Keywords for properties/traits
const RESERVED_KEYS = [
  'anonymous_id',
  'id',
  'sent_at',
  'received_at',
  'timestamp',
  'original_timestamp',
  'event_text',
  'event',
];

const CONFIG_URL =
  'https://api.rudderstack.com/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__';
const SDK_CDN_BASE_URL = '__BASE_CDN_URL__';
const CDN_ARCH_VERSION_DIR = 'v1.1';
const CDN_INT_DIR = 'js-integrations';
const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${CDN_INT_DIR}`;

const DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS = 10000;
const INTG_SUFFIX = '_RS';
// eslint-disable-next-line no-constant-condition
const POLYFILL_URL = '__RS_POLYFILLIO_SDK_URL__'
  ? '__RS_POLYFILLIO_SDK_URL__?version=3.111.0&features=Number.isNaN%2CURL%2CArray.prototype.find%2CArray.prototype.includes%2CPromise%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.startsWith%2CObject.entries%2CObject.values%2CElement.prototype.dataset%2CString.prototype.replaceAll%2CTextEncoder%2Cnavigator.sendBeacon'
  : '';

const SAMESITE_COOKIE_OPTS = ['Lax', 'None', 'Strict'];

const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min in milliseconds
const MIN_SESSION_TIMEOUT = 10 * 1000; // 10 sec in milliseconds
const MIN_SESSION_ID_LENGTH = 10;

const DEFAULT_REGION = 'US';
const DEFAULT_DATAPLANE_URL = 'https://hosted.rudderlabs.com';

const RESIDENCY_SERVERS = [DEFAULT_REGION, 'EU'];

const SUPPORTED_CONSENT_MANAGERS = ['oneTrust', 'ketch'];

const SYSTEM_KEYWORDS = ['library', 'consentManagement'];
const UA_CH_LEVELS = ['none', 'default', 'full'];

const DEFAULT_INTEGRATIONS_CONFIG = { All: true };

// xhr request timeout
const REQUEST_TIMEOUT_MS = 30 * 1000;

const FAILED_REQUEST_ERR_MSG_PREFIX = 'Request failed with status:';
const ERROR_MESSAGES_TO_BE_FILTERED = [FAILED_REQUEST_ERR_MSG_PREFIX];
const ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME = 'errorReporting';

export {
  RESERVED_KEYS,
  CONFIG_URL,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  DEST_SDK_BASE_URL,
  INTG_SUFFIX,
  POLYFILL_URL,
  SAMESITE_COOKIE_OPTS,
  DEFAULT_SESSION_TIMEOUT,
  MIN_SESSION_TIMEOUT,
  MIN_SESSION_ID_LENGTH,
  DEFAULT_REGION,
  DEFAULT_DATAPLANE_URL,
  RESIDENCY_SERVERS,
  SUPPORTED_CONSENT_MANAGERS,
  SYSTEM_KEYWORDS,
  UA_CH_LEVELS,
  DEFAULT_INTEGRATIONS_CONFIG,
  DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,
  REQUEST_TIMEOUT_MS,
  FAILED_REQUEST_ERR_MSG_PREFIX,
  ERROR_MESSAGES_TO_BE_FILTERED,
  ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME,
};
