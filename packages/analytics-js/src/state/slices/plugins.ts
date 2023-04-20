import { signal, Signal } from '@preact/signals-core';
import { Nullable } from '@rudderstack/analytics-js/types';

export type PluginsState = {
  ready: Signal<boolean>;
  loadedPlugins: Signal<string[]>;
  failedPlugins: Signal<string[]>;
  requestedPlugins: Signal<Nullable<string[]>>;
  activePlugins: Signal<string[]>;
};

const pluginsState: PluginsState = {
  ready: signal(false),
  loadedPlugins: signal([]),
  failedPlugins: signal([]),
  requestedPlugins: signal(null),
  activePlugins: signal([]),
};

export { pluginsState };
