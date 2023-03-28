import { signal, Signal } from '@preact/signals-core';

export type PluginsState = {
  ready: Signal<boolean>;
  loadedPlugins: Signal<string[]>;
  failedPlugins: Signal<string[]>;
  requestedPlugins: Signal<string[]>;
};

const pluginsState: PluginsState = {
  ready: signal(false),
  loadedPlugins: signal([]),
  failedPlugins: signal([]),
  requestedPlugins: signal([]),
};

export { pluginsState };
