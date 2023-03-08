import {
  isBrowser,
  isNode,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection';

/*
 * Only support debug mode on browser and node, not web workers.
 * when url contains query param JS_PLUGIN_DEBUG
 */
const isPluginEngineDebugMode =
  (isBrowser && document.location.search.includes('JS_PLUGIN_DEBUG')) ||
  (isNode && process.env && process.env.JS_PLUGIN_DEBUG);

export { isPluginEngineDebugMode };
