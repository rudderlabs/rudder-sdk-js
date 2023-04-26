import {
  storageEncryptionV1,
  googleLinker,
  LoadIntegrations,
  RemotePlugin,
  RemotePlugin2,
  externalAnonymousId,
} from '@rudderstack/analytics-js-plugins/index';
import { PluginMap } from '@rudderstack/analytics-js/components/pluginsManager/types';

const legacyBuildPluginImports = (): PluginMap => ({
  StorageEncryptionV1: storageEncryptionV1,
  GoogleLinker: googleLinker,
  LoadIntegrations,
  // TODO: delete the dummy plugins
  RemotePlugin,
  RemotePlugin2,
  externalAnonymousId,
});

export default legacyBuildPluginImports;
