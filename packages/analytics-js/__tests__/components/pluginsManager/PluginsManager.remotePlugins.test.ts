import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultPluginEngine } from '@rudderstack/analytics-js-common/__mocks__/PluginEngine';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { state, resetState } from '../../../src/state';

const mockRemotePluginsInventory = jest.fn();

jest.mock('../../../src/components/pluginsManager/pluginsInventory', () => ({
  ...jest.requireActual('../../../src/components/pluginsManager/pluginsInventory'),
  remotePluginsInventory: (...args: any[]) => mockRemotePluginsInventory(...args),
}));

const fetchFailure = (url: string) =>
  new TypeError(`Failed to fetch dynamically imported module: ${url}`);

const REMOTE_ENTRY = 'https://cdn.rudderlabs.com/3.34.1/modern/plugins/rsa-plugins.js';

// registerRemotePlugins is fire-and-forget; let its promises settle.
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('PluginsManager - remote plugins', () => {
  let pluginsManager: PluginsManager;

  beforeEach(() => {
    resetState();
    pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
    jest.clearAllMocks();
  });

  it('should report a single error when every remote plugin fails to load', async () => {
    const failing = ['XhrQueue', 'StorageEncryption', 'GoogleLinker'];
    state.plugins.activePlugins.value = failing as any;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(fetchFailure(REMOTE_ENTRY))])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    // One remote entry failure fans out to every plugin; it is one incident.
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(state.plugins.failedPlugins.value).toEqual(failing);
  });

  it('should still log every individual plugin failure', async () => {
    const failing = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing as any;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(fetchFailure(REMOTE_ENTRY))])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultLogger.error).toHaveBeenCalledTimes(failing.length);
  });

  it('should still report when one remote plugin never settles', async () => {
    state.plugins.activePlugins.value = ['XhrQueue', 'StorageEncryption'] as any;
    mockRemotePluginsInventory.mockReturnValue({
      // A stalled import must not suppress the incident for the ones that failed.
      XhrQueue: () => new Promise(() => {}),
      StorageEncryption: () => Promise.reject(fetchFailure(REMOTE_ENTRY)),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(state.plugins.failedPlugins.value).toEqual(['StorageEncryption']);
  });

  it('should not report an error when every remote plugin loads', async () => {
    state.plugins.activePlugins.value = ['XhrQueue'] as any;
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.resolve({ default: () => ({ name: 'XhrQueue' }) }),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
    expect(state.plugins.failedPlugins.value).toEqual([]);
  });
});
