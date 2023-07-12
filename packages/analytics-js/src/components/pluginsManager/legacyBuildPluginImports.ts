// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BeaconQueue,
  ConsentOrchestrator,
  DeviceModeTransformation,
  DeviceModeDestinations,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  NativeDestinationQueue,
  StorageEncryption,
  StorageEncryptionLegacy,
  StorageMigrator,
  XhrQueue,
  OneTrustConsentManager,
  Bugsnag,
} from '@rudderstack/analytics-js-plugins/index';
import { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const legacyBuildPluginImports = (): PluginMap => ({
  Bugsnag,
  BeaconQueue,
  ConsentOrchestrator,
  DeviceModeTransformation,
  DeviceModeDestinations,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  NativeDestinationQueue,
  StorageEncryption,
  StorageEncryptionLegacy,
  StorageMigrator,
  XhrQueue,
  OneTrustConsentManager,
});

export { legacyBuildPluginImports };
