import { signal } from '@preact/signals-core';
import { PluginsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const pluginsState: PluginsState = {
  ready: signal(false),
  loadedPlugins: signal([]),
  failedPlugins: signal([]),
  pluginsToLoadFromConfig: signal([]),
  activePlugins: signal([]),
  totalPluginsToLoad: signal(0),
};

export { pluginsState };
