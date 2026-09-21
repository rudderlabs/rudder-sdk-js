import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
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

const PLUGINS_CDN_PATH = 'https://cdn.rudderlabs.com/v3/modern/plugins';
const REMOTE_ENTRY_URL = `${PLUGINS_CDN_PATH}/rsa-plugins.js`;

// registerRemotePlugins is fire-and-forget; let its promises settle.
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('PluginsManager - remote plugin module shape', () => {
  let pluginsManager: PluginsManager;

  beforeEach(() => {
    resetState();
    state.lifecycle.pluginsCDNPath.value = PLUGINS_CDN_PATH;
    pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
    jest.clearAllMocks();
  });

  // A blocker or a proxy can answer the chunk with a module that parses but exports nothing.
  it.each([
    ['an empty module', {}],
    ['a module without a default export', { get: () => undefined, init: () => undefined }],
    ['a module whose default is not callable', { default: {} }],
  ])('should reject %s', async (_label, remotePluginModule) => {
    state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.resolve(remotePluginModule),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultPluginEngine.register).not.toHaveBeenCalled();
    expect(state.plugins.failedPlugins.value).toEqual(['XhrQueue']);
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
  });

  // Grouping on the message split one bug across two dozen groups in production.
  it('should group on the remote entry whatever the host bundler named its local', async () => {
    const groupingHashFor = async (rejection: unknown): Promise<unknown> => {
      resetState();
      state.lifecycle.pluginsCDNPath.value = PLUGINS_CDN_PATH;
      state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
      const manager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
      jest.clearAllMocks();
      mockRemotePluginsInventory.mockReturnValue({
        XhrQueue: () => Promise.reject(rejection),
      });

      manager.registerRemotePlugins();
      await flush();

      return (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0].groupingHash;
    };

    // Real identifiers from the reported cluster, plus the WebKit phrasing.
    const rejections = [
      new TypeError('lK.init is not a function'),
      new TypeError('ne.init is not a function'),
      new TypeError("a.init is not a function. (In 'a.init(l)', 'a.init' is undefined)"),
      new SyntaxError('Unexpected end of input'),
    ];

    for (const rejection of rejections) {
      // eslint-disable-next-line no-await-in-loop
      expect(await groupingHashFor(rejection)).toBe(REMOTE_ENTRY_URL);
    }
  });

  it('should register a plugin whose module exports a factory', async () => {
    const plugin = { name: 'XhrQueue' };
    state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.resolve({ default: () => plugin }),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultPluginEngine.register).toHaveBeenCalledWith(plugin, state);
    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
    expect(state.plugins.failedPlugins.value).toEqual([]);
  });
});
