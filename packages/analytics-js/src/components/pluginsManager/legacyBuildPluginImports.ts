// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BeaconQueue,
  ConsentManager,
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

const legacyBuildPluginImports = (): PluginMap => ({
  BeaconQueue,
  ConsentManager,
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
