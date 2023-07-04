import {
  isUndefined,
  isNull,
  isNullOrUndefined,
  isFunction,
} from '@rudderstack/common/utilities/checks';

const isBrowser = (): boolean => !isUndefined(globalThis) && !isUndefined(globalThis.document);

const isNode = (): boolean =>
  !isUndefined(process) && !isNull(process.versions) && !isNull(process.versions.node);

const hasCrypto = (): boolean =>
  !isNullOrUndefined(globalThis.crypto) && isFunction(globalThis.crypto.getRandomValues);

const hasUAClientHints = (): boolean => !isNullOrUndefined(globalThis.navigator.userAgentData);

const hasBeacon = (): boolean =>
  !isNullOrUndefined(globalThis.navigator.sendBeacon) &&
  isFunction(globalThis.navigator.sendBeacon);

const isIE11 = (): boolean => Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));

export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon, isIE11 };
