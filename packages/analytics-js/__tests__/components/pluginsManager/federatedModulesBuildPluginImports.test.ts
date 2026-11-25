import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { federatedModulesBuildPluginImports } from '../../../src/components/pluginsManager/federatedModulesBuildPluginImports';
import { state, resetState } from '../../../src/state';

const PLUGINS_CDN_PATH = 'https://proxy.example.com/plugins';

// The SDK imports each plugin module by URL; under Jest the dynamic import becomes a require.
// jest.mock is hoisted, hence the literal URLs.
jest.mock(
  'https://proxy.example.com/plugins/rsa-plugins-remote-XhrQueue.min.js',
  () => ({ __esModule: true, default: () => ({ name: 'XhrQueue' }) }),
  { virtual: true },
);
jest.mock(
  'https://cdn.rudderlabs.com/v3/rsa-plugins-remote-GoogleLinker.min.js',
  () => ({ __esModule: true, default: () => ({ name: 'GoogleLinker' }) }),
  { virtual: true },
);

describe('federatedModulesBuildPluginImports', () => {
  beforeEach(() => {
    resetState();
    state.lifecycle.pluginsCDNPath.value = PLUGINS_CDN_PATH;
  });

  it('should map only known plugin names to lazy remote imports', () => {
    const imports = federatedModulesBuildPluginImports([
      'XhrQueue',
      'StorageEncryption',
      'UnknownPlugin' as PluginName,
    ]);

    expect(Object.keys(imports)).toEqual(['XhrQueue', 'StorageEncryption']);
  });

  it('should import the plugin module from the plugins CDN path', async () => {
    const pluginModule = await federatedModulesBuildPluginImports(['XhrQueue']).XhrQueue?.();

    expect((pluginModule as any).default().name).toBe('XhrQueue');
  });

  it('should fall back to the build time plugins base path', async () => {
    state.lifecycle.pluginsCDNPath.value = undefined;

    const pluginModule = await federatedModulesBuildPluginImports([
      'GoogleLinker',
    ]).GoogleLinker?.();

    expect((pluginModule as any).default().name).toBe('GoogleLinker');
  });

  it('should reject when the plugin module cannot be loaded', async () => {
    await expect(
      federatedModulesBuildPluginImports(['StorageMigrator']).StorageMigrator?.(),
    ).rejects.toThrow('rsa-plugins-remote-StorageMigrator.min.js');
  });
});
