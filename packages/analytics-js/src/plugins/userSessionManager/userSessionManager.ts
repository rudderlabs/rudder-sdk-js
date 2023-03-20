import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/PluginEngine';

// TODO: the v1.1 storage part joined with the auto session feature
const userSessionManager: ExtensionPlugin = {
  name: 'userSessionManager',
  deps: [],
};

export { userSessionManager };
