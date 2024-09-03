import { CustomConsentManager } from '@rudderstack/analytics-js-plugins/customConsentManager';
import { DeviceModeDestinations } from '@rudderstack/analytics-js-plugins/deviceModeDestinations';
import { DeviceModeTransformation } from '@rudderstack/analytics-js-plugins/deviceModeTransformation';
import { ErrorReporting } from '@rudderstack/analytics-js-plugins/errorReporting';
import { ExternalAnonymousId } from '@rudderstack/analytics-js-plugins/externalAnonymousId';
import { GoogleLinker } from '@rudderstack/analytics-js-plugins/googleLinker';
import { KetchConsentManager } from '@rudderstack/analytics-js-plugins/ketchConsentManager';
import { NativeDestinationQueue } from '@rudderstack/analytics-js-plugins/nativeDestinationQueue';
import { OneTrustConsentManager } from '@rudderstack/analytics-js-plugins/oneTrustConsentManager';
import { StorageEncryption } from '@rudderstack/analytics-js-plugins/storageEncryption';
import { StorageEncryptionLegacy } from '@rudderstack/analytics-js-plugins/storageEncryptionLegacy';
import { StorageMigrator } from '@rudderstack/analytics-js-plugins/storageMigrator';
import type { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const getBundledBuildPluginImports = (): PluginMap => ({
  CustomConsentManager,
  DeviceModeDestinations,
  DeviceModeTransformation,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  KetchConsentManager,
  NativeDestinationQueue,
  OneTrustConsentManager,
  StorageEncryption,
  StorageEncryptionLegacy,
  StorageMigrator,
});

export { getBundledBuildPluginImports };
