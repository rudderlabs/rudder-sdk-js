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
      state.plugins.pluginsToLoadFromConfig.value = undefined;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual([]);
    });

    it('should return the default optional plugins if no plugins were configured in the state', () => {
      // All other plugins require some state variables to be set which by default are not set
      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['ExternalAnonymousId', 'GoogleLinker'].sort(),
      );
    });

    it('should not filter the data plane queue plugin if it is automatically configured', () => {
      state.dataPlaneEvents.eventsQueuePluginName.value = 'XhrQueue';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['XhrQueue', 'ExternalAnonymousId', 'GoogleLinker'].sort(),
      );
    });

    it('should add the data plane queue plugin if it is not configured through the plugins input', () => {
      state.plugins.pluginsToLoadFromConfig.value = [];
      state.dataPlaneEvents.eventsQueuePluginName.value = 'XhrQueue';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig()).toEqual(['XhrQueue']);

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Data plane events delivery is enabled, but 'XhrQueue' plugin was not configured to load. So, the plugin will be loaded automatically.",
      );
    });

    it('should not filter the error reporting plugins if it is configured to load by default', () => {
      state.reporting.isErrorReportingEnabled.value = true;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['ExternalAnonymousId', 'GoogleLinker'].sort(),
      );
    });

    it('should not filter the device mode destination plugins if they are configured', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          },
        },
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        [
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ].sort(),
      );
    });

    it('should filter the device mode destination plugins if they are not configured through the plugins input', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          },
        },
      ];
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual([]);

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
          },
        },
      ];
      // Only DeviceModeDestinations is configured
      state.plugins.pluginsToLoadFromConfig.value = ['DeviceModeDestinations'];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual([
        'DeviceModeDestinations',
      ]);

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
          },
        },
        {
          config: {
            connectionMode: 'device',
          },
          shouldApplyDeviceModeTransformation: true,
        },
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        [
          'DeviceModeTransformation',
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ].sort(),
      );
    });

    it('should filter device mode transformation plugin if it is not configured through the plugins input', () => {
      // At least one device mode destination is configured
      state.nativeDestinations.configuredDestinations.value = [
        {
          config: {
            connectionMode: 'device',
          },
          shouldApplyDeviceModeTransformation: true,
        },
      ];
      state.plugins.pluginsToLoadFromConfig.value = [
        'DeviceModeDestinations',
        'NativeDestinationQueue',
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['DeviceModeDestinations', 'NativeDestinationQueue'].sort(),
      );

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Device mode transformations are enabled for at least one destination, but 'DeviceModeTransformation' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage encryption plugin if it is configured to load by default', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['StorageEncryption', 'ExternalAnonymousId', 'GoogleLinker'].sort(),
      );
    });

    it('should filter storage encryption plugin if it is not configured through the plugins input', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual([]);

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Storage encryption is enabled, but 'StorageEncryption' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage migrator plugin if it is configured to load by default', () => {
      state.storage.migrate.value = true;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual(
        ['StorageMigrator', 'ExternalAnonymousId', 'GoogleLinker'].sort(),
      );
    });

    it('should filter storage migrator plugin if it is not configured through the plugins input', () => {
      state.storage.migrate.value = true;
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual([]);

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Storage migration is enabled, but 'StorageMigrator' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not log any warning if logger is not supplied', () => {
      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler);

      // Checking only for the migration plugin
      state.storage.migrate.value = true;
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort()).toEqual([]);
      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });
  });
});
