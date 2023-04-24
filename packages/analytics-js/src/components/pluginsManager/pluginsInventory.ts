import { PluginMap } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { localTest } from '@rudderstack/analytics-js/plugins/dummyToDelete/localTest1';
import { localTest2 } from '@rudderstack/analytics-js/plugins/dummyToDelete/localTest2';
import { localTest3 } from '@rudderstack/analytics-js/plugins/dummyToDelete/localTest3';
import { dummyMultiLifeCyclePlugin } from '@rudderstack/analytics-js/plugins/dummyToDelete/dummyMultiLifeCyclePlugin';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import legacyBuildPluginImports from './legacyBuildPluginImports';
import modernBuildPluginImports from './modernBuildPluginImports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
(window as any).rudderEmptyPluginImports = () => {}; // Is used as replacement for modern builds from rollup

const getMandatoryPluginsMap = (): PluginMap => ({});

const getOptionalPluginsMap = (): PluginMap => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {
      localTest,
      localTest2,
      localTest3,
      dummyMultiLifeCyclePlugin,
    };
  }

  return {
    localTest,
    localTest2,
    localTest3,
    dummyMultiLifeCyclePlugin,
    ...legacyBuildPluginImports(),
  };
};

const getRemotePluginsMap = (): PluginMap<Promise<ExtensionPlugin>> => modernBuildPluginImports();

const pluginsInventory: PluginMap = {
  ...getMandatoryPluginsMap(),
  ...getOptionalPluginsMap(),
};

const remotePluginsInventory: PluginMap<Promise<ExtensionPlugin>> = {
  ...getRemotePluginsMap(),
};

export { pluginsInventory, remotePluginsInventory };
