import type { IPluginEngine } from '../src/types/PluginEngine';

class PluginEngine implements IPluginEngine {
  // mock all the properties and methods of the PluginEngine class
  plugins: any[] = [];
  byName: any = {};
  cache: any = {};
  config: any = { throws: true };
  register = jest.fn();
  unregister = jest.fn();
  getPlugin = jest.fn();
  getPlugins = jest.fn();
  invoke = jest.fn();
  invokeSingle = jest.fn();
  invokeMultiple = jest.fn();
}

const defaultPluginEngine = new PluginEngine();

export { PluginEngine, defaultPluginEngine };
