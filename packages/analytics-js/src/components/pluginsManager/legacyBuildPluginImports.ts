// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BeaconQueue,
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
  KetchConsentManager,
  Bugsnag,
} from '@rudderstack/analytics-js-plugins/index';
import { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const legacyBuildPluginImports = (): PluginMap => ({
  Bugsnag,
  BeaconQueue,
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
  KetchConsentManager,
});

export { legacyBuildPluginImports };
