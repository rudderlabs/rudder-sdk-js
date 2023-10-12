import { signal } from '@preact/signals-core';
const pluginsState = {
  ready: signal(false),
  loadedPlugins: signal([]),
  failedPlugins: signal([]),
  pluginsToLoadFromConfig: signal([]),
  activePlugins: signal([]),
  totalPluginsToLoad: signal(0),
};
export { pluginsState };
