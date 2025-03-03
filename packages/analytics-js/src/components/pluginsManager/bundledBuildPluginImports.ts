import { BeaconQueue } from '@rudderstack/analytics-js-plugins/beaconQueue';
import { CustomConsentManager } from '@rudderstack/analytics-js-plugins/customConsentManager';
import { DeviceModeDestinations } from '@rudderstack/analytics-js-plugins/deviceModeDestinations';
import { DeviceModeTransformation } from '@rudderstack/analytics-js-plugins/deviceModeTransformation';
import { ExternalAnonymousId } from '@rudderstack/analytics-js-plugins/externalAnonymousId';
import { GoogleLinker } from '@rudderstack/analytics-js-plugins/googleLinker';
import { IubendaConsentManager } from '@rudderstack/analytics-js-plugins/iubendaConsentManager';
import { KetchConsentManager } from '@rudderstack/analytics-js-plugins/ketchConsentManager';
import { NativeDestinationQueue } from '@rudderstack/analytics-js-plugins/nativeDestinationQueue';
import { OneTrustConsentManager } from '@rudderstack/analytics-js-plugins/oneTrustConsentManager';
import { StorageEncryption } from '@rudderstack/analytics-js-plugins/storageEncryption';
import { StorageEncryptionLegacy } from '@rudderstack/analytics-js-plugins/storageEncryptionLegacy';
import { StorageMigrator } from '@rudderstack/analytics-js-plugins/storageMigrator';
import { XhrQueue } from '@rudderstack/analytics-js-plugins/xhrQueue';
import type { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const getBundledBuildPluginImports = (): PluginMap => ({
  BeaconQueue,
  CustomConsentManager,
  DeviceModeDestinations,
  DeviceModeTransformation,
  ExternalAnonymousId,
  GoogleLinker,
  IubendaConsentManager,
  KetchConsentManager,
  NativeDestinationQueue,
  OneTrustConsentManager,
  StorageEncryption,
  StorageEncryptionLegacy,
  StorageMigrator,
  XhrQueue,
});

export { getBundledBuildPluginImports };
