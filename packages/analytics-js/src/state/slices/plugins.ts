import { signal, Signal } from '@preact/signals-core';

export type PluginsState = {
  ready: Signal<boolean>;
  loadedPlugins: Signal<string[]>;
  failedPlugins: Signal<string[]>;
  pluginsToLoadFromConfig: Signal<string[]>;
  activePlugins: Signal<string[]>;
  totalPluginsToLoad: Signal<number>;
};

const pluginsState: PluginsState = {
  ready: signal(false),
  loadedPlugins: signal([]),
  failedPlugins: signal([]),
  pluginsToLoadFromConfig: signal([]),
  activePlugins: signal([]),
  totalPluginsToLoad: signal(0),
};

export { pluginsState };
