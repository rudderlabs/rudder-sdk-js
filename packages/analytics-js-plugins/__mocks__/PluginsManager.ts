import type { IPluginEngine } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { defaultPluginEngine } from './PluginEngine';

class PluginsManager implements IPluginsManager {
  // mock all the properties and methods of the PluginsManager class
  engine: IPluginEngine = defaultPluginEngine;
  init = jest.fn();
  attachEffects = jest.fn();
  setActivePlugins = jest.fn();
  invokeMultiple = jest.fn();
  invokeSingle = jest.fn();
  register = jest.fn();
}

const defaultPluginsManager = new PluginsManager();

export { PluginsManager, defaultPluginsManager };
