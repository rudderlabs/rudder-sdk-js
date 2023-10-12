import {
  isUndefined,
  isNull,
  isNullOrUndefined,
  isFunction,
} from '@rudderstack/analytics-js-common/utilities/checks';
const isBrowser = () => !isUndefined(globalThis) && !isUndefined(globalThis.document);
const isNode = () =>
  !isUndefined(process) && !isNull(process.versions) && !isNull(process.versions.node);
const hasCrypto = () =>
  !isNullOrUndefined(globalThis.crypto) && isFunction(globalThis.crypto.getRandomValues);
const hasUAClientHints = () => !isNullOrUndefined(globalThis.navigator.userAgentData);
const hasBeacon = () =>
  !isNullOrUndefined(globalThis.navigator.sendBeacon) &&
  isFunction(globalThis.navigator.sendBeacon);
const isIE11 = () => Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));
export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon, isIE11 };
