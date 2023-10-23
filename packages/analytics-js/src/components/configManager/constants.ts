import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

const DEFAULT_ERROR_REPORTING_PROVIDER = 'bugsnag';
const DEFAULT_STORAGE_ENCRYPTION_VERSION = 'v3';

export const ConsentManagersToPluginNameMap: Record<string, PluginName> = {
  oneTrust: 'OneTrustConsentManager',
  ketch: 'KetchConsentManager',
  custom: 'CustomConsentManager',
};

export const ErrorReportingProvidersToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_ERROR_REPORTING_PROVIDER]: 'Bugsnag',
};

export const StorageEncryptionVersionsToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_STORAGE_ENCRYPTION_VERSION]: 'StorageEncryption',
  legacy: 'StorageEncryptionLegacy',
};

export { DEFAULT_ERROR_REPORTING_PROVIDER, DEFAULT_STORAGE_ENCRYPTION_VERSION };
