export { detectAdBlockers } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/adBlockers';
export {
  isBrowser,
  isNode,
  hasCrypto,
  hasUAClientHints,
  hasBeacon,
  isIE11,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';
export { getUserAgentClientHint } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/clientHint';
export {
  isDatasetAvailable,
  legacyJSEngineRequiredPolyfills,
  isLegacyJSEngine,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/dom';
export { getScreenDetails } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';
export {
  isStorageAvailable,
  isStorageQuotaExceeded,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/storage';
