const DEFAULT_ERROR_REPORTING_PROVIDER = 'bugsnag';
const DEFAULT_STORAGE_ENCRYPTION_VERSION = 'v3';
export const ConsentManagersToPluginNameMap = {
  oneTrust: 'OneTrustConsentManager',
  ketch: 'KetchConsentManager',
};
export const ErrorReportingProvidersToPluginNameMap = {
  [DEFAULT_ERROR_REPORTING_PROVIDER]: 'Bugsnag',
};
export const StorageEncryptionVersionsToPluginNameMap = {
  [DEFAULT_STORAGE_ENCRYPTION_VERSION]: 'StorageEncryption',
  legacy: 'StorageEncryptionLegacy',
};
export { DEFAULT_ERROR_REPORTING_PROVIDER, DEFAULT_STORAGE_ENCRYPTION_VERSION };
