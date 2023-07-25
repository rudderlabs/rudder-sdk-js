import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { StorageEncryptionVersion } from '@rudderstack/analytics-js-common/types/Storage';

const DEFAULT_ERROR_REPORTING_PROVIDER = 'bugsnag';
const DEFAULT_STORAGE_ENCRYPTION_VERSION = StorageEncryptionVersion.V3;

export const ConsentManagersToPluginNameMap: Record<string, PluginName> = {
  oneTrust: PluginName.OneTrustConsentManager,
  ketch: PluginName.KetchConsentManager,
};

export const ErrorReportingProvidersToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_ERROR_REPORTING_PROVIDER]: PluginName.Bugsnag,
};

export const StorageEncryptionVersionsToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_STORAGE_ENCRYPTION_VERSION]: PluginName.StorageEncryption,
  [StorageEncryptionVersion.Legacy]: PluginName.StorageEncryptionLegacy,
};

export { DEFAULT_ERROR_REPORTING_PROVIDER, DEFAULT_STORAGE_ENCRYPTION_VERSION };
