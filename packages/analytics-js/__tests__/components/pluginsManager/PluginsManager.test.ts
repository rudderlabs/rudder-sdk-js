import type {
  Destination,
  DestinationConfig,
} from '@rudderstack/analytics-js-common/types/Destination';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { state, resetState } from '../../../src/state';
import { defaultOptionalPluginsList } from '../../../src/components/pluginsManager/defaultPluginsList';

let pluginsManager: PluginsManager;

describe('PluginsManager', () => {
  beforeAll(() => {
    defaultLogger.warn = jest.fn();
    defaultLogger.error = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getPluginsToLoadBasedOnConfig', () => {
    beforeEach(() => {
      resetState();

      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);

      state.plugins.pluginsToLoadFromConfig.value = defaultOptionalPluginsList;
    });

    it('should return empty array if plugins list is set to undefined in the state', () => {
      // @ts-expect-error needed for testing
      state.plugins.pluginsToLoadFromConfig.value = undefined;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));
    });

    it('should return the default optional plugins if no plugins were configured in the state', () => {
      // All other plugins require some state variables to be set which by default are not set
      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['ExternalAnonymousId', 'GoogleLinker']),
      );
    });

    it('should not filter the data plane queue plugin if it is automatically configured', () => {
      state.dataPlaneEvents.eventsQueuePluginName.value = 'XhrQueue';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['XhrQueue', 'ExternalAnonymousId', 'GoogleLinker']),
      );
    });

    it('should add the data plane queue plugin if it is not configured through the plugins input', () => {
      state.plugins.pluginsToLoadFromConfig.value = [];
      state.dataPlaneEvents.eventsQueuePluginName.value = 'XhrQueue';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['XhrQueue']),
      );

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Data plane events delivery is enabled, but 'XhrQueue' plugin was not configured to load. So, the plugin will be loaded automatically.",
      );
    });

    it('should not filter the device mode destination plugins if they are configured', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
        } as unknown as Destination,
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining([
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ]),
      );
    });

    it('should filter the device mode destination plugins if they are not configured through the plugins input', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
        } as unknown as Destination,
      ];
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Device mode destinations are connected to the source, but ['DeviceModeDestinations', 'NativeDestinationQueue'] plugins were not configured to load. Ignore if this was intentional. Otherwise, consider adding them to the 'plugins' load API option.",
      );
    });

    it('should log a warning even if the device mode destination plugins were partially not configured', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
        } as unknown as Destination,
      ];
      // Only DeviceModeDestinations is configured
      state.plugins.pluginsToLoadFromConfig.value = ['DeviceModeDestinations'];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['DeviceModeDestinations']),
      );

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Device mode destinations are connected to the source, but 'NativeDestinationQueue' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter device mode transformation plugin if it is configured to load by default', () => {
      // At least one device mode destination is configured
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
        } as unknown as Destination,
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
          shouldApplyDeviceModeTransformation: true,
        } as unknown as Destination,
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining([
          'DeviceModeTransformation',
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ]),
      );
    });

    it('should filter device mode transformation plugin if it is not configured through the plugins input', () => {
      // At least one device mode destination is configured
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          } as unknown as DestinationConfig,
          shouldApplyDeviceModeTransformation: true,
        } as unknown as Destination,
      ];
      state.plugins.pluginsToLoadFromConfig.value = [
        'DeviceModeDestinations',
        'NativeDestinationQueue',
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['DeviceModeDestinations', 'NativeDestinationQueue']),
      );

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Device mode transformations are enabled for at least one destination, but 'DeviceModeTransformation' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage encryption plugin if it is configured to load by default', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['StorageEncryption', 'ExternalAnonymousId', 'GoogleLinker']),
      );
    });

    it('should filter storage encryption plugin if it is not configured through the plugins input', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Storage encryption is enabled, but 'StorageEncryption' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage migrator plugin if it is configured to load by default', () => {
      state.storage.migrate.value = true;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(
        expect.arrayContaining(['StorageMigrator', 'ExternalAnonymousId', 'GoogleLinker']),
      );
    });

    it('should filter storage migrator plugin if it is not configured through the plugins input', () => {
      state.storage.migrate.value = true;
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Storage migration is enabled, but 'StorageMigrator' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should log a warning if deprecated plugins are configured', () => {
      state.plugins.pluginsToLoadFromConfig.value = [
        'ErrorReporting',
        'Bugsnag',
        'StorageMigrator',
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(2);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'PluginsManager:: ErrorReporting plugin is deprecated. Please exclude it from the load API options.',
      );
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'PluginsManager:: Bugsnag plugin is deprecated. Please exclude it from the load API options.',
      );
    });

    it('should not log any warning if logger is not supplied', () => {
      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler);

      // Checking only for the migration plugin
      state.storage.migrate.value = true;
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(expect.arrayContaining([]));
      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });
  });
});
