import { isFunction, isNullOrUndefined } from './checks';

const hasCrypto = (): boolean =>
  !isNullOrUndefined(globalThis.crypto) && isFunction(globalThis.crypto.getRandomValues);

export { hasCrypto };
