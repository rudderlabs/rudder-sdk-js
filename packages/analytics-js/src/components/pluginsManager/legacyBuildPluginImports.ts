// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BeaconQueue,
  ConsentManager,
  DataplaneEventsQueue,
  DeviceModeTransformation,
  DeviceModeDestinations,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  NativeDestinationQueue,
  StorageEncryption,
  StorageEncryptionLegacy,
  XhrQueue,
} from '@rudderstack/analytics-js-plugins/index';
import { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const legacyBuildPluginImports = (): PluginMap => ({
  BeaconQueue,
  ConsentManager,
  DataplaneEventsQueue,
  DeviceModeTransformation,
  DeviceModeDestinations,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  NativeDestinationQueue,
  StorageEncryption,
  StorageEncryptionLegacy,
  XhrQueue,
});

export { legacyBuildPluginImports };
