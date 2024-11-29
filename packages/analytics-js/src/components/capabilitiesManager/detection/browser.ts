import {
  isUndefined,
  isNull,
  isNullOrUndefined,
  isFunction,
} from '@rudderstack/analytics-js-common/utilities/checks';

const isBrowser = (): boolean => !isUndefined(globalThis) && !isUndefined(globalThis.document);

const isNode = (): boolean =>
  !isUndefined(process) && !isNull(process.versions) && !isNull(process.versions.node);

const hasCrypto = (): boolean =>
  !isNullOrUndefined(globalThis.crypto) && isFunction(globalThis.crypto.getRandomValues);

// eslint-disable-next-line compat/compat -- We are checking for the existence of navigator.userAgentData
const hasUAClientHints = (): boolean => !isNullOrUndefined(globalThis.navigator.userAgentData);

const isIE11 = (): boolean => Boolean(/Trident.*rv:11\./.exec(globalThis.navigator.userAgent));

export { isBrowser, isNode, hasCrypto, hasUAClientHints, isIE11 };
