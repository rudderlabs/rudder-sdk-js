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

const fetchFailure = (url: string) =>
  new TypeError(`Failed to fetch dynamically imported module: ${url}`);

const REMOTE_ENTRY = 'https://cdn.rudderlabs.com/3.34.1/modern/plugins/rsa-plugins.js';

// Module federation resolves each import through several awaits, so sibling
// rejections do not all land in the same microtask round. Reproduce that depth,
// otherwise a one-hop Promise.reject makes the ordering look far more forgiving
// than it is in a browser.
const rejectAfterHops = (hops: number, err: Error) => {
  let p: Promise<unknown> = Promise.resolve();
  for (let i = 0; i < hops; i += 1) {
    p = p.then(() => undefined);
  }
  return p.then(() => {
    throw err;
  });
};

// registerRemotePlugins is fire-and-forget; let its promises settle.
const flush = () => new Promise(resolve => setTimeout(resolve, 20));

describe('PluginsManager - remote plugins', () => {
  let pluginsManager: PluginsManager;

  beforeEach(() => {
    resetState();
    pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
    jest.clearAllMocks();
  });

  it('should report a single error when every remote plugin fails to load', async () => {
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption', 'GoogleLinker'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(fetchFailure(REMOTE_ENTRY))])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    // One remote entry failure fans out to every plugin; it is one incident.
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(state.plugins.failedPlugins.value).toEqual(failing);
  });

  it('should name every failed plugin in the reported message', async () => {
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption', 'GoogleLinker'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(
        failing.map((name, i) => [name, () => rejectAfterHops(i + 1, fetchFailure(REMOTE_ENTRY))]),
      ),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const customMessage = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0].customMessage;
    failing.forEach(name => expect(customMessage).toContain(name));
  });

  it('should still log every individual plugin failure', async () => {
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(fetchFailure(REMOTE_ENTRY))])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultLogger.error).toHaveBeenCalledTimes(failing.length);
  });

  it('should still report when one remote plugin never settles', async () => {
    state.plugins.activePlugins.value = ['XhrQueue', 'StorageEncryption'] satisfies PluginName[];
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

  it('should not attribute earlier local plugin failures to this incident', async () => {
    // setActivePlugins, registerLocalPlugins and register() all push into the
    // same state.plugins.failedPlugins list before any remote import runs.
    state.plugins.failedPlugins.value = ['UnknownPlugin', 'UnavailableLocalPlugin'];
    state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.reject(fetchFailure(REMOTE_ENTRY)),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    const { customMessage } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(customMessage).toContain('XhrQueue');
    expect(customMessage).not.toContain('UnknownPlugin');
    expect(customMessage).not.toContain('UnavailableLocalPlugin');
  });

  it('should give a reason when the rejection is not an Error', async () => {
    state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.reject('boom'),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultLogger.error).toHaveBeenCalledWith(expect.stringContaining('boom'));
  });

  it('should not report an error when every remote plugin loads', async () => {
    state.plugins.activePlugins.value = ['XhrQueue'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.resolve({ default: () => ({ name: 'XhrQueue' }) }),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
    expect(state.plugins.failedPlugins.value).toEqual([]);
  });
});
