import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';

export type PluginMap<T = ExtensionPlugin> = Record<string, () => T>;
