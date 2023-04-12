import {
  storageEncryptionV1,
  googleLinker,
  LoadIntegrations,
  RemotePlugin,
  RemotePlugin2,
} from '@rudderstack/analytics-js-plugins/index';

const legacyBuildPluginImports = () => ({
  StorageEncryptionV1: storageEncryptionV1,
  GoogleLinker: googleLinker,
  LoadIntegrations,
  // TODO: delete the dummy plugins
  RemotePlugin,
  RemotePlugin2,
});

export default legacyBuildPluginImports;
