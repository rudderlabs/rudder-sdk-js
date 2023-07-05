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
  XhrQueue,
  OneTrust,
  Bugsnag,
} from '@rudderstack/analytics-js-plugins/index';
import { PluginMap } from './types';

/**
 * Map plugin names to direct code imports from plugins package
 */
const legacyBuildPluginImports = (): PluginMap => ({
  Bugsnag,
  BeaconQueue,
  ConsentManager,
  DeviceModeTransformation,
  DeviceModeDestinations,
  ErrorReporting,
  ExternalAnonymousId,
  GoogleLinker,
  NativeDestinationQueue,
  StorageEncryption,
  XhrQueue,
  OneTrust,
});

export { legacyBuildPluginImports };
