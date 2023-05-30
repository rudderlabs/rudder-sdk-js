import {
  isUndefined,
  isNull,
  isNullOrUndefined,
  isFunction,
} from '@rudderstack/analytics-js/components/utilities/checks';

const isBrowser = (): boolean => !isUndefined(window) && !isUndefined(window.document);

const isNode = (): boolean =>
  !isUndefined(process) && !isNull(process.versions) && !isNull(process.versions.node);

const hasCrypto = (): boolean =>
  !isNullOrUndefined(window.crypto) && isFunction(window.crypto.getRandomValues);

const hasUAClientHints = (): boolean => !isNullOrUndefined(window.navigator.userAgentData);

const hasBeacon = (): boolean =>
  !isNullOrUndefined(window.navigator.sendBeacon) && isFunction(window.navigator.sendBeacon);

const isIE11 = (): boolean => Boolean(window.navigator.userAgent.match(/Trident.*rv:11\./));

export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon, isIE11 };
