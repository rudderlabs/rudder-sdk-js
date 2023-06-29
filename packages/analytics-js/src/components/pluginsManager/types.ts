import { ExtensionPlugin } from '@rudderstack/common/types/PluginEngine';

export type PluginMap<T = ExtensionPlugin> = Record<string, () => T>;
