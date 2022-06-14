// Reserved Keywords for properties/traits
const RESERVED_KEYS = [
  "anonymous_id",
  "id",
  "sent_at",
  "received_at",
  "timestamp",
  "original_timestamp",
  "event_text",
  "event",
];

const CONFIG_URL =
  "https://api.rudderlabs.com/sourceConfig/?p=process.module_type&v=process.package_version";
const CDN_INT_DIR = "js-integrations";
const DEST_SDK_BASE_URL = `https://cdn.rudderlabs.com/v1.1/${CDN_INT_DIR}`;

const MAX_WAIT_FOR_INTEGRATION_LOAD = 10000;
const INTEGRATION_LOAD_CHECK_INTERVAL = 1000;
const INTG_SUFFIX = "_RS";
const POLYFILL_URL =
  "https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.find%2CArray.prototype.includes%2CPromise%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.startsWith%2CObject.entries";

const GENERIC_TRUE_VALUES = ["true", "True", "TRUE", "t", "T", "1"];
const GENERIC_FALSE_VALUES = ["false", "False", "FALSE", "f", "F", "0"];

export {
  RESERVED_KEYS,
  CONFIG_URL,
  CDN_INT_DIR,
  DEST_SDK_BASE_URL,
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
  INTG_SUFFIX,
  POLYFILL_URL,
  GENERIC_TRUE_VALUES,
  GENERIC_FALSE_VALUES,
};
