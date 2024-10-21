import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

const DEFAULT_STORAGE_ENCRYPTION_VERSION = 'v3';

export const ConsentManagersToPluginNameMap: Record<string, PluginName> = {
  iubenda: 'IubendaConsentManager',
  oneTrust: 'OneTrustConsentManager',
  ketch: 'KetchConsentManager',
  custom: 'CustomConsentManager',
};

export const StorageEncryptionVersionsToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_STORAGE_ENCRYPTION_VERSION]: 'StorageEncryption',
  legacy: 'StorageEncryptionLegacy',
};

const DEFAULT_DATA_SERVICE_ENDPOINT = 'rsaRequest';
const METRICS_SERVICE_ENDPOINT = 'rsaMetrics';

export {
  DEFAULT_STORAGE_ENCRYPTION_VERSION,
  DEFAULT_DATA_SERVICE_ENDPOINT,
  METRICS_SERVICE_ENDPOINT,
};
