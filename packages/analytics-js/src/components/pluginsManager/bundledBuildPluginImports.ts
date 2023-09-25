import { BeaconQueue } from '@rudderstack/analytics-js-plugins/beaconQueue';
import { Bugsnag } from '@rudderstack/analytics-js-plugins/bugsnag';
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
import { XhrQueue } from '@rudderstack/analytics-js-plugins/xhrQueue';
import { PluginMap } from './types';
import { pluginNamesList } from './pluginNames';

/**
 * Map plugin names to direct code imports from plugins package
 */
const getBundledBuildPluginImports = (): PluginMap => {
  const bundledBuildPluginImports = {} as PluginMap;
  let resolvedPluginList = '__BUNDLED_PLUGINS_LIST__' ? '__BUNDLED_PLUGINS_LIST__'.split(',') : [];

  // If no plugin list is specified as env variables all plugins are bundled
  if (resolvedPluginList.length === 0) {
    resolvedPluginList = pluginNamesList;
  }

  // Add only imports that are required in the bundle, rest are tree-shook as dead code in build time
  if (resolvedPluginList.includes('BeaconQueue')) {
    bundledBuildPluginImports.BeaconQueue = BeaconQueue;
  }

  if (resolvedPluginList.includes('Bugsnag')) {
    bundledBuildPluginImports.Bugsnag = Bugsnag;
  }

  if (resolvedPluginList.includes('DeviceModeDestinations')) {
    bundledBuildPluginImports.DeviceModeDestinations = DeviceModeDestinations;
  }

  if (resolvedPluginList.includes('DeviceModeTransformation')) {
    bundledBuildPluginImports.DeviceModeTransformation = DeviceModeTransformation;
  }

  if (resolvedPluginList.includes('ErrorReporting')) {
    bundledBuildPluginImports.ErrorReporting = ErrorReporting;
  }

  if (resolvedPluginList.includes('ExternalAnonymousId')) {
    bundledBuildPluginImports.ExternalAnonymousId = ExternalAnonymousId;
  }

  if (resolvedPluginList.includes('GoogleLinker')) {
    bundledBuildPluginImports.GoogleLinker = GoogleLinker;
  }

  if (resolvedPluginList.includes('KetchConsentManager')) {
    bundledBuildPluginImports.KetchConsentManager = KetchConsentManager;
  }

  if (resolvedPluginList.includes('NativeDestinationQueue')) {
    bundledBuildPluginImports.NativeDestinationQueue = NativeDestinationQueue;
  }

  if (resolvedPluginList.includes('OneTrustConsentManager')) {
    bundledBuildPluginImports.OneTrustConsentManager = OneTrustConsentManager;
  }

  if (resolvedPluginList.includes('StorageEncryption')) {
    bundledBuildPluginImports.StorageEncryption = StorageEncryption;
  }

  if (resolvedPluginList.includes('StorageEncryptionLegacy')) {
    bundledBuildPluginImports.StorageEncryptionLegacy = StorageEncryptionLegacy;
  }

  if (resolvedPluginList.includes('StorageMigrator')) {
    bundledBuildPluginImports.StorageMigrator = StorageMigrator;
  }

  if (resolvedPluginList.includes('XhrQueue')) {
    bundledBuildPluginImports.XhrQueue = XhrQueue;
  }

  return bundledBuildPluginImports;
};

export { getBundledBuildPluginImports };
