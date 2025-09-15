import { isString } from './checks';

/**
 * Determines if the SDK is running inside a chrome extension
 * @returns boolean
 */
const isSDKRunningInChromeExtension = (): boolean => !!(window as any).chrome?.runtime?.id;

const isIE11 = (): boolean =>
  isString(globalThis.navigator.userAgent) &&
  /Trident.*rv:11\./.test(globalThis.navigator.userAgent);

export { isSDKRunningInChromeExtension, isIE11 };
