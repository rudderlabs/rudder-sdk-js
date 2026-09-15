import {
  CUSTOMERIO_NAME as NAME,
  CUSTOMERIO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'CustomerIO';

const CNameMapping = {
  [NAME]: NAME,
  Customerio: NAME,
  'Customer.io': NAME,
  'CUSTOMER.IO': NAME,
  'customer.io': NAME,
};

// Destination config key selecting the Customer.io client to load (top-level string, 'v1' or 'v2',
// like the destination's cloud-mode apiVersion). Missing/invalid resolves to 1.x.
const SDK_VERSION_CONFIG_KEY = 'sdkVersion';
const SDK_V1 = 'v1';
const SDK_V2 = 'v2';

const EU_DATACENTER = 'EU';

// 2.x: Customer.io JavaScript client (Data Pipelines), loaded from the CDP CDN with a write key.
const V2_GLOBAL_NAME = 'cioanalytics';
const V2_GLOBAL_KEY_ATTRIBUTE = 'data-global-customerio-analytics-key';
const V2_CDN_HOST = 'https://cdp.customer.io';
const V2_CDN_HOST_EU = 'https://cdp-eu.customer.io';
const V2_SNIPPET_PATH = '/v1/analytics-js/snippet';
const V2_SNIPPET_FILE = 'analytics.min.js';
// Methods the client's snippet stub queues until the bundle loads (mirrors Customer.io's snippet).
const V2_STUB_METHODS = [
  'trackSubmit',
  'trackClick',
  'trackLink',
  'trackForm',
  'pageview',
  'identify',
  'reset',
  'group',
  'track',
  'ready',
  'alias',
  'debug',
  'page',
  'once',
  'off',
  'on',
  'addSourceMiddleware',
  'addIntegrationMiddleware',
  'setAnonymousId',
  'addDestinationMiddleware',
];
const IN_APP_PLUGIN_KEY = 'Customer.io In-App Plugin';

export {
  NAME,
  CNameMapping,
  DISPLAY_NAME,
  DIR_NAME,
  SDK_VERSION_CONFIG_KEY,
  SDK_V1,
  SDK_V2,
  EU_DATACENTER,
  V2_GLOBAL_NAME,
  V2_GLOBAL_KEY_ATTRIBUTE,
  V2_CDN_HOST,
  V2_CDN_HOST_EU,
  V2_SNIPPET_PATH,
  V2_SNIPPET_FILE,
  V2_STUB_METHODS,
  IN_APP_PLUGIN_KEY,
};
