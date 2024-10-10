import type { Nullable } from './Nullable';

export interface ExtensionPoint {
  [lifeCycleName: string]: (...args: any[]) => any;
}

/**
 * ExtensionPoint can be nested, e.g. 'sdk.initialize.phase1'
 * When index signature is provided, every key have to match the type, the types
 * for 'name', 'deps',  and 'initialize' is added as index signature.
 */
export interface ExtensionPlugin {
  name: string;
  initialize?: (state?: any) => void;
  deps?: string[];
  [key: string]:
    | string
    | (() => void)
    | ExtensionPoint
    | ((...args: any[]) => any)
    | string[]
    | undefined;
}

export type PluginEngineConfig = {
  throws?: boolean | RegExp;
};

export interface IPluginEngine {
  private_plugins: ExtensionPlugin[];
  private_byName: Record<string, ExtensionPlugin>;
  private_cache: Record<string, ExtensionPlugin[]>;
  private_config: PluginEngineConfig;
  register: (plugin: ExtensionPlugin, state?: Record<string, any>) => void;
  unregister: (name: string) => void;
  getPlugin: (name: string) => ExtensionPlugin | undefined;
  getPlugins: (extPoint?: string) => ExtensionPlugin[];
  private_invoke: <T = any>(
    extPoint?: string,
    allowMultiple?: boolean,
    ...args: any[]
  ) => Nullable<T>[];
  invokeSingle: <T = any>(extPoint?: string, ...args: any[]) => Nullable<T>;
  invokeMultiple: <T = any>(extPoint?: string, ...args: any[]) => Nullable<T>[];
}
