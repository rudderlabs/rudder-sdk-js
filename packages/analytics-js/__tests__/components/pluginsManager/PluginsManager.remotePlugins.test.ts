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

const chunkOf = (name: string) =>
  `https://cdn.rudderlabs.com/3.34.1/modern/plugins/rsa-plugins-remote-${name}.min.js`;

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
const flush = () => new Promise(resolve => setTimeout(resolve, 200));

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

  it('should name a sibling that rejects from a later task', async () => {
    state.plugins.activePlugins.value = ['XhrQueue', 'StorageEncryption'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => Promise.reject(fetchFailure(REMOTE_ENTRY)),
      // Not every sibling rejects inside the first task's microtask cascade.
      StorageEncryption: () =>
        new Promise((_resolve, reject) => {
          setTimeout(() => reject(fetchFailure(REMOTE_ENTRY)), 50);
        }),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    const { customMessage } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(customMessage).toContain('XhrQueue');
    expect(customMessage).toContain('StorageEncryption');
  });

  it('should not report while one remote plugin has not settled', async () => {
    state.plugins.activePlugins.value = ['XhrQueue', 'StorageEncryption'] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      XhrQueue: () => new Promise(() => {}),
      StorageEncryption: () => Promise.reject(fetchFailure(REMOTE_ENTRY)),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    // Deliberate: the report waits for every import so it can name all of them,
    // and a dynamic import has no timeout of its own. Holding a timer open to
    // salvage a partial report would spend page resources on error reporting.
    // The failure is still logged and still recorded in state.
    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
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
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
  });

  it('should report the plugin failure when the rejection resists inspection', async () => {
    // isTypeOfError runs Object.prototype.toString.call, which reads
    // Symbol.toStringTag, so a throwing tag getter (or a revoked proxy) throws during
    // classification -- this time on the report path, where the outer catch would
    // again replace the aggregate message with the inspection error.
    const hostile = {
      get [Symbol.toStringTag](): string {
        throw new Error('tag getter');
      },
    };
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(hostile)])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const { customMessage } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(customMessage).toBe('Failed to load plugins: StorageEncryption, XhrQueue');
  });

  it('should report the plugin failure when the rejection cannot be coerced', async () => {
    // Object.create(null) has no toString, so String() on it throws. Unguarded, that
    // throw rejects the catch handler, Promise.all rejects with it, the aggregate
    // report is skipped, and the outer catch reports the coercion TypeError in place
    // of the plugin failure.
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject(Object.create(null))])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const { customMessage } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(customMessage).toBe('Failed to load plugins: StorageEncryption, XhrQueue');
  });

  it('should coerce a non-string rejection message to a string', async () => {
    // getErrorGroupingHash rejects a non-string hash and falls back to the full report
    // message, which embeds the plugin list -- so one reason would split into a group
    // per list.
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject({ message: 503 })])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const { groupingHash } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(groupingHash).toBe('503');
  });

  it('should still report when the chosen cause is not an Error', async () => {
    // ErrorHandler runs the cause through normalizeError, which drops anything that is
    // not a real Error, and then returns without reporting. Choosing the cause by the
    // most widely shared reason makes that silence deterministic rather than a matter
    // of which import rejected first, so the reason has to be carried as an Error.
    const failing: PluginName[] = ['XhrQueue', 'StorageEncryption'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(failing.map(name => [name, () => Promise.reject('boom')])),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const { error, groupingHash } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('boom');
    expect(groupingHash).toBe('boom');
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

  it('should list the failed plugins in sorted order', async () => {
    // The order imports reject in is a race, so the message must not depend on it:
    // the same incident was observed in production reading two different ways an
    // hour apart.
    const failing: PluginName[] = ['XhrQueue', 'ExternalAnonymousId', 'StorageMigrator'];
    state.plugins.activePlugins.value = failing;
    mockRemotePluginsInventory.mockReturnValue(
      Object.fromEntries(
        failing.map((name, i) => [name, () => rejectAfterHops(i + 1, fetchFailure(REMOTE_ENTRY))]),
      ),
    );

    pluginsManager.registerRemotePlugins();
    await flush();

    const { customMessage } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(customMessage).toBe(
      'Failed to load plugins: ExternalAnonymousId, StorageMigrator, XhrQueue',
    );
  });

  it('should report the same cause whichever import rejects first', async () => {
    // The reported cause becomes the BugSnag grouping key, so a race here smears
    // one incident across several groups.
    const runWithFirst = async (first: PluginName) => {
      resetState();
      jest.clearAllMocks();
      pluginsManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
      const failing: PluginName[] = ['XhrQueue', 'ExternalAnonymousId'];
      state.plugins.activePlugins.value = failing;
      mockRemotePluginsInventory.mockReturnValue(
        Object.fromEntries(
          failing.map(name => [
            name,
            () => rejectAfterHops(name === first ? 1 : 4, fetchFailure(chunkOf(name))),
          ]),
        ),
      );

      pluginsManager.registerRemotePlugins();
      await flush();

      return (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0].error.message;
    };

    expect(await runWithFirst('XhrQueue')).toBe(await runWithFirst('ExternalAnonymousId'));
  });

  it('should report the cause shared by the most plugins', async () => {
    // Two plugins failed on the shared remote entry and one on its own chunk. The
    // shared URL is the root cause and deserves to be the group, even though the
    // plugin that failed alone sorts first.
    state.plugins.activePlugins.value = [
      'ExternalAnonymousId',
      'StorageMigrator',
      'XhrQueue',
    ] satisfies PluginName[];
    mockRemotePluginsInventory.mockReturnValue({
      ExternalAnonymousId: () =>
        rejectAfterHops(1, fetchFailure(chunkOf('ExternalAnonymousId'))),
      StorageMigrator: () => rejectAfterHops(2, fetchFailure(REMOTE_ENTRY)),
      XhrQueue: () => rejectAfterHops(3, fetchFailure(REMOTE_ENTRY)),
    });

    pluginsManager.registerRemotePlugins();
    await flush();

    const { error } = (defaultErrorHandler.onError as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe(fetchFailure(REMOTE_ENTRY).message);
  });
});
