import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultPluginEngine } from '@rudderstack/analytics-js-common/__mocks__/PluginEngine';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { state, resetState } from '../../../src/state';
import { defaultOptionalPluginsList } from '../../../src/components/pluginsManager/defaultPluginsList';

let pluginsManager: PluginsManager;

describe('PluginsManager', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      resetState();
      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
      jest.clearAllMocks();
    });

    it('should successfully register valid plugins', () => {
      const mockPlugins = [
        { name: 'TestPlugin1', init: jest.fn() },
        { name: 'TestPlugin2', init: jest.fn() },
      ];

      pluginsManager.register(mockPlugins);

      expect(defaultPluginEngine.register).toHaveBeenCalledTimes(2);
      expect(defaultPluginEngine.register).toHaveBeenCalledWith(mockPlugins[0], state);
      expect(defaultPluginEngine.register).toHaveBeenCalledWith(mockPlugins[1], state);
    });

    it('should handle plugin registration errors and add failed plugins to state', () => {
      const mockPlugins = [
        { name: 'ValidPlugin', init: jest.fn() },
        { name: 'FailingPlugin', init: jest.fn() },
      ];

      // Mock the engine register to throw for the second plugin
      defaultPluginEngine.register.mockImplementation(plugin => {
        if (plugin.name === 'FailingPlugin') {
          throw new Error('Plugin registration failed');
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');
      const initialFailedPlugins = [...state.plugins.failedPlugins.value];

      pluginsManager.register(mockPlugins);

      // Verify the valid plugin was still registered
      expect(defaultPluginEngine.register).toHaveBeenCalledTimes(2);

      // Verify the failing plugin was added to failed plugins
      expect(state.plugins.failedPlugins.value).toEqual([...initialFailedPlugins, 'FailingPlugin']);

      // Verify error handler was called with correct parameters
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to register plugin "FailingPlugin"',
        groupingHash: undefined,
      });

      errorHandlerSpy.mockRestore();
    });

    it('should handle multiple plugin registration failures', () => {
      const mockPlugins = [
        { name: 'FailingPlugin1', init: jest.fn() },
        { name: 'FailingPlugin2', init: jest.fn() },
        { name: 'ValidPlugin', init: jest.fn() },
      ];

      // Mock the engine register to throw for failing plugins
      defaultPluginEngine.register.mockImplementation(plugin => {
        if (plugin.name.includes('Failing')) {
          throw new Error(`Registration failed for ${plugin.name}`);
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');
      const initialFailedPlugins = [...state.plugins.failedPlugins.value];

      pluginsManager.register(mockPlugins);

      // Verify all plugins registration was attempted
      expect(defaultPluginEngine.register).toHaveBeenCalledTimes(3);

      // Verify both failing plugins were added to failed plugins
      expect(state.plugins.failedPlugins.value).toEqual([
        ...initialFailedPlugins,
        'FailingPlugin1',
        'FailingPlugin2',
      ]);

      // Verify error handler was called for each failing plugin
      expect(errorHandlerSpy).toHaveBeenCalledTimes(2);
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to register plugin "FailingPlugin1"',
        groupingHash: undefined,
      });
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to register plugin "FailingPlugin2"',
        groupingHash: undefined,
      });

      errorHandlerSpy.mockRestore();
    });

    it('should handle empty plugin array', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.register([]);

      expect(defaultPluginEngine.register).not.toHaveBeenCalled();
      expect(errorHandlerSpy).not.toHaveBeenCalled();

      errorHandlerSpy.mockRestore();
    });

    it('should handle different types of errors during registration', () => {
      const mockPlugins = [
        { name: 'TypeErrorPlugin', init: jest.fn() },
        { name: 'ReferenceErrorPlugin', init: jest.fn() },
      ];

      // Mock different types of errors
      defaultPluginEngine.register.mockImplementation(plugin => {
        if (plugin.name === 'TypeErrorPlugin') {
          throw new TypeError('Invalid plugin type');
        }
        if (plugin.name === 'ReferenceErrorPlugin') {
          throw new ReferenceError('Plugin reference not found');
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.register(mockPlugins);

      expect(errorHandlerSpy).toHaveBeenCalledTimes(2);
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(TypeError),
        context: 'PluginsManager',
        customMessage: 'Failed to register plugin "TypeErrorPlugin"',
        groupingHash: undefined,
      });
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(ReferenceError),
        context: 'PluginsManager',
        customMessage: 'Failed to register plugin "ReferenceErrorPlugin"',
        groupingHash: undefined,
      });

      errorHandlerSpy.mockRestore();
    });
  });

  describe('unregisterLocalPlugins', () => {
    beforeEach(() => {
      resetState();
      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
      jest.clearAllMocks();
    });

    it('should successfully unregister all local plugins', () => {
      // Mock pluginsInventory to have some test plugins
      const mockPluginsInventory = {
        TestPlugin1: () => ({ name: 'TestPlugin1' }),
        TestPlugin2: () => ({ name: 'TestPlugin2' }),
      };

      // Mock the pluginsInventory import
      const pluginsInventoryModule = require('../../../src/components/pluginsManager/pluginsInventory');
      const originalInventory = pluginsInventoryModule.pluginsInventory;
      pluginsInventoryModule.pluginsInventory = mockPluginsInventory;

      pluginsManager.unregisterLocalPlugins();

      expect(defaultPluginEngine.unregister).toHaveBeenCalledTimes(2);
      expect(defaultPluginEngine.unregister).toHaveBeenCalledWith('TestPlugin1');
      expect(defaultPluginEngine.unregister).toHaveBeenCalledWith('TestPlugin2');

      // Restore original inventory
      pluginsInventoryModule.pluginsInventory = originalInventory;
    });

    it('should handle plugin unregistration errors and call error handler', () => {
      // Mock pluginsInventory to have some test plugins
      const mockPluginsInventory = {
        ValidPlugin: () => ({ name: 'ValidPlugin' }),
        FailingPlugin: () => ({ name: 'FailingPlugin' }),
      };

      // Mock the pluginsInventory import
      const pluginsInventoryModule = require('../../../src/components/pluginsManager/pluginsInventory');
      const originalInventory = pluginsInventoryModule.pluginsInventory;
      pluginsInventoryModule.pluginsInventory = mockPluginsInventory;

      // Mock the engine unregister to throw for the failing plugin
      defaultPluginEngine.unregister.mockImplementation(pluginName => {
        if (pluginName === 'FailingPlugin') {
          throw new Error('Plugin unregistration failed');
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.unregisterLocalPlugins();

      // Verify all plugins unregistration was attempted
      expect(defaultPluginEngine.unregister).toHaveBeenCalledTimes(2);
      expect(defaultPluginEngine.unregister).toHaveBeenCalledWith('ValidPlugin');
      expect(defaultPluginEngine.unregister).toHaveBeenCalledWith('FailingPlugin');

      // Verify error handler was called for the failing plugin
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to unregister plugin "FailingPlugin"',
        groupingHash: undefined,
      });

      // Restore original inventory
      pluginsInventoryModule.pluginsInventory = originalInventory;
      errorHandlerSpy.mockRestore();
    });

    it('should handle multiple plugin unregistration failures', () => {
      // Mock pluginsInventory to have failing plugins
      const mockPluginsInventory = {
        FailingPlugin1: () => ({ name: 'FailingPlugin1' }),
        FailingPlugin2: () => ({ name: 'FailingPlugin2' }),
        ValidPlugin: () => ({ name: 'ValidPlugin' }),
      };

      // Mock the pluginsInventory import
      const pluginsInventoryModule = require('../../../src/components/pluginsManager/pluginsInventory');
      const originalInventory = pluginsInventoryModule.pluginsInventory;
      pluginsInventoryModule.pluginsInventory = mockPluginsInventory;

      // Mock the engine unregister to throw for failing plugins
      defaultPluginEngine.unregister.mockImplementation(pluginName => {
        if (pluginName.includes('Failing')) {
          throw new Error(`Unregistration failed for ${pluginName}`);
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.unregisterLocalPlugins();

      // Verify all plugins unregistration was attempted
      expect(defaultPluginEngine.unregister).toHaveBeenCalledTimes(3);

      // Verify error handler was called for each failing plugin
      expect(errorHandlerSpy).toHaveBeenCalledTimes(2);
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to unregister plugin "FailingPlugin1"',
        groupingHash: undefined,
      });
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to unregister plugin "FailingPlugin2"',
        groupingHash: undefined,
      });

      // Restore original inventory
      pluginsInventoryModule.pluginsInventory = originalInventory;
      errorHandlerSpy.mockRestore();
    });

    it('should handle empty plugins inventory', () => {
      // Mock empty pluginsInventory
      const mockPluginsInventory = {};

      // Mock the pluginsInventory import
      const pluginsInventoryModule = require('../../../src/components/pluginsManager/pluginsInventory');
      const originalInventory = pluginsInventoryModule.pluginsInventory;
      pluginsInventoryModule.pluginsInventory = mockPluginsInventory;

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.unregisterLocalPlugins();

      expect(defaultPluginEngine.unregister).not.toHaveBeenCalled();
      expect(errorHandlerSpy).not.toHaveBeenCalled();

      // Restore original inventory
      pluginsInventoryModule.pluginsInventory = originalInventory;
      errorHandlerSpy.mockRestore();
    });

    it('should handle different types of errors during unregistration', () => {
      // Mock pluginsInventory to have plugins that cause different errors
      const mockPluginsInventory = {
        TypeErrorPlugin: () => ({ name: 'TypeErrorPlugin' }),
        NetworkErrorPlugin: () => ({ name: 'NetworkErrorPlugin' }),
      };

      // Mock the pluginsInventory import
      const pluginsInventoryModule = require('../../../src/components/pluginsManager/pluginsInventory');
      const originalInventory = pluginsInventoryModule.pluginsInventory;
      pluginsInventoryModule.pluginsInventory = mockPluginsInventory;

      // Mock different types of errors
      defaultPluginEngine.unregister.mockImplementation(pluginName => {
        if (pluginName === 'TypeErrorPlugin') {
          throw new TypeError('Invalid plugin type during unregistration');
        }
        if (pluginName === 'NetworkErrorPlugin') {
          throw new Error('Network error during plugin cleanup');
        }
      });

      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError');

      pluginsManager.unregisterLocalPlugins();

      expect(errorHandlerSpy).toHaveBeenCalledTimes(2);
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(TypeError),
        context: 'PluginsManager',
        customMessage: 'Failed to unregister plugin "TypeErrorPlugin"',
        groupingHash: undefined,
      });
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: expect.any(Error),
        context: 'PluginsManager',
        customMessage: 'Failed to unregister plugin "NetworkErrorPlugin"',
        groupingHash: undefined,
      });

      // Restore original inventory
      pluginsInventoryModule.pluginsInventory = originalInventory;
      errorHandlerSpy.mockRestore();
    });
  });

  describe('getPluginsToLoadBasedOnConfig', () => {
    /**
     * Compare function to sort strings alphabetically using localeCompare.
     *
     * @param {string} a
     * @param {string} b
     * @returns {number} Negative if a < b, positive if a > b, zero if equal
     */
    const alphabeticalCompare = (a: string, b: string) =>
      // Using "undefined" locale so that JavaScript decides the best locale.
      // The { sensitivity: 'base' } option makes it case-insensitive
      a.localeCompare(b);

    beforeEach(() => {
      resetState();

      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);

      state.plugins.pluginsToLoadFromConfig.value = defaultOptionalPluginsList;
    });

    it('should return the default optional plugins if no plugins were configured in the state', () => {
      // All other plugins require some state variables to be set which by default are not set
      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['ExternalAnonymousId', 'GoogleLinker'].sort(alphabeticalCompare),
      );
    });

    it('should not filter the data plane queue plugin if it is automatically configured', () => {
      state.dataPlaneEvents.eventsQueuePluginName.value = 'XhrQueue';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['XhrQueue', 'ExternalAnonymousId', 'GoogleLinker'].sort(alphabeticalCompare),
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

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['ExternalAnonymousId', 'GoogleLinker'].sort(alphabeticalCompare),
      );
    });

    it('should not filter the device mode destination plugins if they are configured', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          id: 'dest1',
          displayName: 'Destination 1',
          userFriendlyId: 'dest1',
          shouldApplyDeviceModeTransformation: false,
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
        },
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        [
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ].sort(alphabeticalCompare),
      );
    });

    it('should filter the device mode destination plugins if they are not configured through the plugins input', () => {
      // Non-empty array
      state.nativeDestinations.configuredDestinations.value = [
        {
          id: 'dest1',
          displayName: 'Destination 1',
          userFriendlyId: 'dest1',
          shouldApplyDeviceModeTransformation: false,
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
        },
      ];
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual([]);

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
          id: 'dest1',
          displayName: 'Destination 1',
          userFriendlyId: 'dest1',
          shouldApplyDeviceModeTransformation: false,
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
        },
      ];
      // Only DeviceModeDestinations is configured
      state.plugins.pluginsToLoadFromConfig.value = ['DeviceModeDestinations'];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual([
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
          id: 'dest1',
          displayName: 'Destination 1',
          userFriendlyId: 'dest1',
          shouldApplyDeviceModeTransformation: false,
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
        },
        {
          id: 'dest2',
          displayName: 'Destination 2',
          userFriendlyId: 'dest2',
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
          shouldApplyDeviceModeTransformation: true,
        },
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        [
          'DeviceModeTransformation',
          'DeviceModeDestinations',
          'NativeDestinationQueue',
          'ExternalAnonymousId',
          'GoogleLinker',
        ].sort(alphabeticalCompare),
      );
    });

    it('should filter device mode transformation plugin if it is not configured through the plugins input', () => {
      // At least one device mode destination is configured
      state.nativeDestinations.configuredDestinations.value = [
        {
          id: 'dest1',
          displayName: 'Destination 1',
          userFriendlyId: 'dest1',
          shouldApplyDeviceModeTransformation: true,
          enabled: true,
          propagateEventsUntransformedOnError: false,
          config: {
            connectionMode: 'device',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
          },
        },
      ];
      state.plugins.pluginsToLoadFromConfig.value = [
        'DeviceModeDestinations',
        'NativeDestinationQueue',
      ];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['DeviceModeDestinations', 'NativeDestinationQueue'].sort(alphabeticalCompare),
      );

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Device mode transformations are enabled for at least one destination, but 'DeviceModeTransformation' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage encryption plugin if it is configured to load by default', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['StorageEncryption', 'ExternalAnonymousId', 'GoogleLinker'].sort(alphabeticalCompare),
      );
    });

    it('should filter storage encryption plugin if it is not configured through the plugins input', () => {
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual([]);

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        "PluginsManager:: Storage encryption is enabled, but 'StorageEncryption' plugin was not configured to load. Ignore if this was intentional. Otherwise, consider adding it to the 'plugins' load API option.",
      );
    });

    it('should not filter storage migrator plugin if it is configured to load by default', () => {
      state.storage.migrate.value = true;

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual(
        ['StorageMigrator', 'ExternalAnonymousId', 'GoogleLinker'].sort(alphabeticalCompare),
      );
    });

    it('should filter storage migrator plugin if it is not configured through the plugins input', () => {
      state.storage.migrate.value = true;
      state.plugins.pluginsToLoadFromConfig.value = [];

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual([]);

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

      expect(pluginsManager.getPluginsToLoadBasedOnConfig().sort(alphabeticalCompare)).toEqual([]);

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(2);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'PluginsManager:: ErrorReporting plugin is deprecated. Please exclude it from the load API options.',
      );
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'PluginsManager:: Bugsnag plugin is deprecated. Please exclude it from the load API options.',
      );
    });

    it('should log a warning if unknown plugins are configured', () => {
      state.plugins.pluginsToLoadFromConfig.value = [
        'UnknownPlugin1',
        'GoogleLinker',
        'UnknownPlugin2',
      ];

      pluginsManager.setActivePlugins();

      // Expect a warning for user not explicitly configuring it
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'PluginsManager:: Ignoring unknown plugins: UnknownPlugin1, UnknownPlugin2.',
      );
    });
  });
});
