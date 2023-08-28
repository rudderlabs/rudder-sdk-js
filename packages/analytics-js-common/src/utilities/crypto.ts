import { isFunction, isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';

const hasCrypto = (): boolean =>
  !isNullOrUndefined(globalThis.crypto) && isFunction(globalThis.crypto.getRandomValues);

export { hasCrypto };
