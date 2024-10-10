/**
 * Determines if the SDK is running inside a chrome extension
 * @returns boolean
 */
const isSDKRunningInChromeExtension = (): boolean => !!(window as any).chrome?.runtime?.id;

export { isSDKRunningInChromeExtension };
