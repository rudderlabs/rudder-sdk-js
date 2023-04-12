import { PluginMap } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

const modernBuildPluginImports = (): PluginMap<Promise<ExtensionPlugin>> => {
  const lazyLoadRemotePlugin = () => import('remotePlugins/RemotePlugin');
  const lazyLoadRemotePlugin2 = () => import('remotePlugins/RemotePlugin2');
  const lazyLoadRemoteLoadIntegrations = () => import('remotePlugins/LoadIntegrations');
  const storageEncryptionV1 = () => import('remotePlugins/StorageEncryptionV1');
  const googleLinker = () => import('remotePlugins/GoogleLinker');

  return {
    StorageEncryptionV1: storageEncryptionV1,
    GoogleLinker: googleLinker,
    RemotePlugin: lazyLoadRemotePlugin,
    RemotePlugin2: lazyLoadRemotePlugin2,
    LoadIntegrations: lazyLoadRemoteLoadIntegrations,
  };
};

export default modernBuildPluginImports;
