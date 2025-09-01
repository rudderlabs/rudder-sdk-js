/**
 * Determines if the SDK is running inside a chrome extension
 * @returns boolean
 */
const isSDKRunningInChromeExtension = (): boolean => !!(window as any).chrome?.runtime?.id;

const isIE11 = (): boolean => Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));

export { isSDKRunningInChromeExtension, isIE11 };
